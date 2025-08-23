"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateComment } from "@/lib/actions"
import { useToast } from "@/components/ui/toastContext"
import { IComment } from "@/models/Comment"

interface Comment {
  _id: string;
  comment: string;
  rating: number;
  // createdAt: string;
  guestId: {
    fullname: string;
    _id: string;
  };
  isApproved: boolean;
}

interface ApprovalToggleProps {
  comment: Comment;
  initialApproved: boolean
  onToggle?: (approved: boolean) => void
}

export default function ApprovalToggle({ comment, initialApproved, onToggle }: ApprovalToggleProps) {
    console.log(comment)
  const [approved, setApproved] = useState(initialApproved)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true)
    try {
        const fixedComment = {...comment, guestId: comment.guestId._id}
      await updateComment(comment._id, {...fixedComment ,isApproved: checked })
      setApproved(checked)
      if (onToggle) {
        onToggle(checked)
      }
      toast({
        title: `${checked ? "نظر تأیید شد!" : "نظر رد شد!"}`,
        description: "",
      })
    } catch (error: any) {
      toast({
        title: "خطا در به‌روز رسانی!",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div dir="rtl" className="flex items-center gap-2 font-ravi">
        <Label htmlFor={`approved-${comment._id}`} className={isUpdating ? "opacity-50" : ""}>
            {approved ? "تأیید" : "رد"}
        </Label>
      <Switch id={`approved-${comment._id}`} checked={approved} onCheckedChange={handleToggle} disabled={isUpdating} />
    </div>
  )
}

