import mongoose, { type Document, Schema } from "mongoose"

export interface IGuest extends Document {
  fullname: string
  phone: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const GuestSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^(\+98|0)?9\d{9}$/, "Please enter a valid Iranian phone number"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster phone lookups
GuestSchema.index({ phone: 1 })

export default mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema)
