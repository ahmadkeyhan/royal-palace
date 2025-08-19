"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { getTranslations } from "@/lib/i18n"
import { format } from "date-fns"
import { getApprovedCommentsAction } from "@/lib/actions"

interface Comment {
  _id: string
  comment: string
  rating: number
  createdAt: string
  guestId: {
    fullname: string
  }
}

interface CommentsListProps {
  refreshTrigger?: number
}

export default function CommentsList({ refreshTrigger }: CommentsListProps) {
//   const { language } = useLanguage()
//   const t = getTranslations(language)
const { t } = useLanguage()

  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchComments = async () => {
    try {
      const result = await getApprovedCommentsAction()

      if (result.success && result.data) {
        setComments(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [refreshTrigger])

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return "bg-red-100 text-red-800"
    if (rating <= 6) return "bg-yellow-100 text-yellow-800"
    if (rating <= 8) return "bg-blue-100 text-blue-800"
    return "bg-green-100 text-green-800"
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t("comments.noComments")}</h3>
          <p className="text-gray-500">{t("comments.beFirst")}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" />
        {t("comments.guestReviews")} ({comments.length})
      </h2>

      {comments.map((comment) => (
        <Card key={comment._id} className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-start gap-4 pb-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {comment.guestId.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{comment.guestId.fullname}</h4>
                <Badge className={getRatingColor(comment.rating)}>{comment.rating}/10</Badge>
              </div>

              <div className="flex items-center gap-2">
                {renderStars(comment.rating)}
                <span className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
