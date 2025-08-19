import Guest from "@/models/Guest"
import { verifyOTP } from "./otp"
import dbConnect from "./mongodb"

export interface AuthResult {
  success: boolean
  message: string
  guest?: any
}

export async function authenticateWithOTP(phone: string, code: string, fullname?: string): Promise<AuthResult> {
  try {
    await dbConnect()

    // Verify OTP first
    const otpResult = await verifyOTP(phone, code)

    if (!otpResult.success) {
      return {
        success: false,
        message: otpResult.message,
      }
    }

    // Check if guest exists
    let guest = await Guest.findOne({ phone })

    if (!guest) {
      // Create new guest if doesn't exist
      if (!fullname) {
        return {
          success: false,
          message: "Full name is required for new guests",
        }
      }

      guest = new Guest({
        fullname,
        phone,
        isVerified: true,
      })

      await guest.save()
    } else {
      // Update existing guest verification status
      guest.isVerified = true
      if (fullname && fullname !== guest.fullname) {
        guest.fullname = fullname
      }
      await guest.save()
    }

    return {
      success: true,
      message: "Authentication successful",
      guest: {
        id: guest._id,
        fullname: guest.fullname,
        phone: guest.phone,
        isVerified: guest.isVerified,
      },
    }
  } catch (error: any) {
    console.error("Authentication error:", error)
    return {
      success: false,
      message: "Internal server error",
    }
  }
}

export async function findGuestByPhone(phone: string) {
  try {
    await dbConnect()
    const guest = await Guest.findOne({ phone, isVerified: true })

    if (guest) {
      return {
        id: guest._id,
        fullname: guest.fullname,
        phone: guest.phone,
        isVerified: guest.isVerified,
      }
    }

    return null
  } catch (error) {
    console.error("Find guest error:", error)
    return null
  }
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
