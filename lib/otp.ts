import OTP from "@/models/OTP"
import { sendOTP } from "./sms"
import dbConnect from "./mongodb"

export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createAndSendOTP(phone: string): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect()

    console.log("[v0] Creating OTP for phone:", phone)

    // Generate 6-digit OTP
    const code = generateOTPCode()

    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone })

    // Create new OTP record
    const otpRecord = new OTP({
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    })

    await otpRecord.save()
    console.log("[v0] OTP record created in database:", otpRecord._id)

    // Send SMS
    const smsResult = await sendOTP(phone, code)
    console.log("[v0] SMS Result:", smsResult)

    if (smsResult.status === 200 || smsResult.status === 201) {
      return {
        success: true,
        message: "OTP sent successfully",
      }
    } else {
      // Delete the OTP record if SMS failed
      await OTP.deleteOne({ _id: otpRecord._id })
      console.log("[v0] Deleted OTP record due to SMS failure")
      return {
        success: false,
        message: smsResult.message || "Failed to send OTP",
      }
    }
  } catch (error: any) {
    console.error("[v0] Create and send OTP error:", error)
    return {
      success: false,
      message: "Internal server error",
    }
  }
}

export async function verifyOTP(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    await dbConnect()

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      phone,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otpRecord) {
      return {
        success: false,
        message: "Invalid or expired OTP",
      }
    }

    // Mark OTP as used
    otpRecord.isUsed = true
    await otpRecord.save()

    return {
      success: true,
      message: "OTP verified successfully",
    }
  } catch (error: any) {
    console.error("Verify OTP error:", error)
    return {
      success: false,
      message: "Internal server error",
    }
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Iranian phone number validation
  const phoneRegex = /^(\+98|0)?9\d{9}$/
  return phoneRegex.test(phone)
}

export function normalizePhoneNumber(phone: string): string {
  // Convert to standard format: 09xxxxxxxxx
  let normalized = phone.replace(/\s+/g, "")

  if (normalized.startsWith("+98")) {
    normalized = "0" + normalized.slice(3)
  } else if (normalized.startsWith("98")) {
    normalized = "0" + normalized.slice(2)
  }

  return normalized
}
