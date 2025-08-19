const SMS_IR_API_URL = "https://api.sms.ir/v1"
const SMS_IR_API_KEY = process.env.SMS_IR_API_KEY
const SMS_IR_LINE_NUMBER = process.env.SMS_IR_LINE_NUMBER

if (!SMS_IR_API_KEY) {
  throw new Error("Please define the SMS_IR_API_KEY environment variable")
}

if (!SMS_IR_LINE_NUMBER) {
  throw new Error("Please define the SMS_IR_LINE_NUMBER environment variable")
}

export interface SMSResponse {
  status: number
  message: string
  data?: any
}

export async function sendOTP(phone: string, code: string): Promise<SMSResponse> {
  try {
    const response = await fetch(`${SMS_IR_API_URL}/send/verify`, {
      method: "POST",
      headers: {
        "X-API-KEY": SMS_IR_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: phone,
        templateId: process.env.SMS_IR_TEMPLATE_ID,
        parameters: [
          {
            name: "CODE",
            value: code,
          },
        ],
      }),
    })

    const data = await response.json()

    return {
      status: response.status,
      message: "OTP sent successfully",
      data: data,
    }
  } catch (error: any) {
    console.error("SMS.ir API Error:", error.message)

    return {
      status: 500,
      message: "Failed to send OTP",
      data: null,
    }
  }
}

export async function sendSimpleOTP(phone: string, code: string): Promise<SMSResponse> {
  try {
    const message = `کد تایید شما: ${code}\nرویال پالاس`

    console.log("[v0] Sending SMS to:", phone, "with code:", code)
    console.log("[v0] SMS API Key exists:", !!SMS_IR_API_KEY)
    console.log("[v0] SMS Line Number:", SMS_IR_LINE_NUMBER)

    const response = await fetch(`${SMS_IR_API_URL}/send`, {
      method: "POST",
      headers: {
        "X-API-KEY": SMS_IR_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lineNumber: SMS_IR_LINE_NUMBER,
        mobile: phone,
        message: message,
      }),
    })

    const data = await response.json()

    console.log("[v0] SMS API Response Status:", response.status)
    console.log("[v0] SMS API Response Data:", data)

    if (response.status === 200 || response.status === 201) {
      // Check if SMS.ir returned success in their response format
      if (data.status === 1 || data.success === true) {
        return {
          status: response.status,
          message: "OTP sent successfully",
          data: data,
        }
      } else {
        console.error("[v0] SMS.ir API returned error:", data)
        return {
          status: 400,
          message: data.message || "SMS service returned error",
          data: data,
        }
      }
    } else {
      console.error("[v0] SMS API HTTP Error:", response.status, data)
      return {
        status: response.status,
        message: data.message || "Failed to send SMS",
        data: data,
      }
    }
  } catch (error: any) {
    console.error("[v0] SMS.ir API Error:", error.message)

    return {
      status: 500,
      message: "Failed to send OTP - Network error",
      data: null,
    }
  }
}
