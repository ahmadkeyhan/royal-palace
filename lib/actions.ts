"use server"

import { revalidatePath } from "next/cache"
import { createAndSendOTP, normalizePhoneNumber, validatePhoneNumber } from "@/lib/otp"
import { authenticateWithOTP } from "@/lib/auth"
import Comment from "@/models/Comment"
import Guest from "@/models/Guest"
import dbConnect from "@/lib/mongodb"

export async function sendOTPAction(phone: string) {
  try {
    if (!phone) {
      return { success: false, message: "Phone number is required" }
    }

    // Normalize and validate phone number
    const normalizedPhone = normalizePhoneNumber(phone)

    if (!validatePhoneNumber(normalizedPhone)) {
      return { success: false, message: "Invalid phone number format" }
    }

    // Create and send OTP
    const result = await createAndSendOTP(normalizedPhone)
    return result
  } catch (error) {
    console.error("Send OTP action error:", error)
    return { success: false, message: "Internal server error" }
  }
}

export async function verifyOTPAction(phone: string, otpCode: string, fullname?: string) {
  try {
    if (!phone || !otpCode) {
      return { success: false, message: "Phone number and OTP code are required" }
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone)

    // Authenticate with OTP
    const result = await authenticateWithOTP(normalizedPhone, otpCode, fullname)
    return result
  } catch (error) {
    console.error("Verify OTP action error:", error)
    return { success: false, message: "Internal server error" }
  }
}

export async function createCommentAction(guestId: string, comment: string, rating: number) {
  try {
    if (!guestId || !comment || !rating) {
      return { success: false, message: "Guest ID, comment, and rating are required" }
    }

    if (rating < 1 || rating > 10) {
      return { success: false, message: "Rating must be between 1 and 10" }
    }

    if (comment.length < 10 || comment.length > 1000) {
      return { success: false, message: "Comment must be between 10 and 1000 characters" }
    }

    await dbConnect()

    // Verify guest exists and is verified
    const guest = await Guest.findById(guestId)
    if (!guest || !guest.isVerified) {
      return { success: false, message: "Invalid or unverified guest" }
    }

    // Create comment
    const newComment = new Comment({
      guestId,
      comment: comment.trim(),
      rating,
      isApproved: false, // Comments need approval
    })

    await newComment.save()

    revalidatePath("/comments")
    return {
      success: true,
      message: "Comment submitted successfully and is pending approval",
      data: newComment,
    }
  } catch (error) {
    console.error("Create comment action error:", error)
    return { success: false, message: "Internal server error" }
  }
}

export async function submitCommentWithOTPAction(
  fullname: string,
  phone: string,
  comment: string,
  rating: number,
  otpCode: string,
) {
  try {
    if (!fullname || !phone || !comment || !rating || !otpCode) {
      return { success: false, message: "All fields are required" }
    }

    if (rating < 1 || rating > 10) {
      return { success: false, message: "Rating must be between 1 and 10" }
    }

    if (comment.length < 10 || comment.length > 1000) {
      return { success: false, message: "Comment must be between 10 and 1000 characters" }
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone)

    // Verify OTP and create/get guest
    const authResult = await authenticateWithOTP(normalizedPhone, otpCode, fullname)

    if (!authResult.success || !authResult.guest) {
      return { success: false, message: authResult.message }
    }

    await dbConnect()

    // Create comment
    const newComment = new Comment({
      guestId: authResult.guest.id,
      comment: comment.trim(),
      rating,
      isApproved: false, // Comments need approval
    })

    await newComment.save()

    revalidatePath("/comments")
    return {
      success: true,
      message: "Comment submitted successfully and is pending approval",
      data: newComment,
    }
  } catch (error) {
    console.error("Submit comment with OTP action error:", error)
    return { success: false, message: "Internal server error" }
  }
}

export async function getApprovedCommentsAction() {
  try {
    await dbConnect()

    const comments = await Comment.find({ isApproved: true })
      .populate({
        path: "guestId",
        select: "fullname",
        model: "Guest",
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const transformedComments = comments.map((comment: any) => ({
      _id: comment._id.toString(),
      comment: comment.comment,
      rating: comment.rating,
      createdAt: comment.createdAt.toISOString(),
      guestId: {
        fullname: comment.guestId?.fullname || "Anonymous",
      },
    }))

    return { success: true, data: transformedComments }
  } catch (error) {
    console.error("Fetch comments action error:", error)
    return { success: false, message: "Internal server error" }
  }
}
