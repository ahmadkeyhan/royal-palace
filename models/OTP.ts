import mongoose, { type Document, Schema } from "mongoose"

export interface IOTP extends Document {
  phone: string
  code: string
  expiresAt: Date
  isUsed: boolean
  createdAt: Date
}

const OTPSchema: Schema = new Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "OTP code is required"],
      length: [6, "OTP code must be 6 digits"],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for cleanup of expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
OTPSchema.index({ phone: 1 })

export default mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema)
