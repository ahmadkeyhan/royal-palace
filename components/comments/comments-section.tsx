"use client"

import { useState } from "react"
import CommentForm from "./comment-form"
import CommentsList from "./comments-list"
import { Separator } from "@/components/ui/separator"

interface CommentsSectionProps {
  isAuthenticated?: boolean
  guestData?: {
    id: string
    fullname: string
    phone: string
  }
}

export default function CommentsSection({ isAuthenticated, guestData }: CommentsSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCommentSubmitSuccess = () => {
    // Trigger refresh of comments list
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="space-y-8">
      <CommentForm
        isAuthenticated={isAuthenticated}
        guestData={guestData}
        onSubmitSuccess={handleCommentSubmitSuccess}
      />

      <Separator />

      <CommentsList refreshTrigger={refreshTrigger} />
    </div>
  )
}
