import mongoose, { model, Schema } from "mongoose"

export interface IComment {
  _id?: mongoose.Types.ObjectId | string
  guestId: mongoose.Types.ObjectId | string
  comment: string
  rating: number
  isApproved: boolean
  createdAt?: Date
  updatedAt?: Date
}

const CommentSchema = new Schema<IComment>(
  {
    guestId: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
      required: [true, "Guest ID is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot exceed 10"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
CommentSchema.index({ guestId: 1 })
CommentSchema.index({ isApproved: 1 })
CommentSchema.index({ createdAt: -1 })

export const Comment = mongoose.models?.Comment || model<IComment>("Comment", CommentSchema)
