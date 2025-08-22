"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Star, Send, Phone, User, MessageCircle } from "lucide-react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useLanguage } from "@/contexts/LanguageContext"
import { sendOTPAction, createCommentAction, submitCommentWithOTPAction } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

const authenticatedCommentSchema = z.object({
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
  rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),
})

const guestCommentSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^(\+98|0)?9\d{9}$/, "Please enter a valid Iranian phone number"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
  rating: z.number().min(1, "Rating must be at least 1").max(10, "Rating cannot exceed 10"),
})

type CommentFormData = z.infer<typeof guestCommentSchema>

interface CommentFormProps {
  isAuthenticated?: boolean
  guestData?: {
    id: string
    fullname: string
    phone: string
  }
  onSubmitSuccess?: () => void
}

export default function CommentForm({ isAuthenticated = false, guestData, onSubmitSuccess }: CommentFormProps) {
//   const { language } = useLanguage()
//   const t = getTranslations(language)
const { t, isRTL } = useLanguage()

  const [step, setStep] = useState<"form" | "otp">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [pendingData, setPendingData] = useState<CommentFormData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(isAuthenticated ? authenticatedCommentSchema : guestCommentSchema),
    defaultValues: {
      fullname: guestData?.fullname || "",
      phone: guestData?.phone || "",
      comment: "",
      rating: 5,
    },
  })

  const rating = watch("rating")

  const onSubmit = async (data: CommentFormData) => {
    console.log("[v0] Form submission started - isAuthenticated:", isAuthenticated, "guestData:", guestData)
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      if (isAuthenticated && guestData) {

        console.log("[v0] Authenticated user submitting comment:", {
          guestId: guestData.id,
          comment: data.comment,
          rating: data.rating,
        })

        // Authenticated user - submit comment directly
        console.log("[v0] About to call createCommentAction")
        const result = await createCommentAction(guestData.id, data.comment, data.rating)

        console.log("[v0] Create comment result:", result)

        if (result.success) {
          setSuccess(t('comments.submitSuccess'))
          reset()
          onSubmitSuccess?.()
        } else {
          setError(result.message || t("comments.submitError"))
        }
      } else {
        // Non-authenticated user - send OTP first
        console.log('fuck')
        if (!data.fullname || !data.phone) {
          setError(t("comments.namePhoneRequired"))
          return
        }

        console.log("[v0] Sending OTP request with phone:", data.phone)

        const result = await sendOTPAction(data.phone)
        console.log("[v0] OTP Server Action response:", result)

        if (result.success) {
          setPendingData(data)
          setStep("otp")
          setSuccess(t("comments.otpSent"))
        } else {
          setError(result.message || t("comments.otpError"))
        }
      }
    } catch (error) {
        console.error("[v0] Comment submission error:", error)
      setError(t("comments.networkError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    if (!otpCode || otpCode.length !== 6 || !pendingData) {
      setError(t("comments.invalidOtp"))
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const result = await submitCommentWithOTPAction(
        pendingData.fullname!,
        pendingData.phone!,
        pendingData.comment,
        pendingData.rating,
        otpCode,
      )

      if (result.success) {
        setSuccess(t("comments.submitSuccess"))
        setStep("form")
        setOtpCode("")
        setPendingData(null)
        reset()
        onSubmitSuccess?.()
      } else {
        setError(result.message || t("comments.submitError"))
      }
    } catch (error) {
      setError(t("comments.networkError"))
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex gap-[5px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue("rating", star)}
            className={`transition-colors ${
              star <= rating ? "text-golden_yellow" : "text-gray-300"
            } hover:text-golden_yellow`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  if (step === "otp") {
    return (
      <Card className="w-full max-w-md mx-auto text-text_royal_green">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            {t("comments.verifyPhone")}
          </CardTitle>
          <CardDescription className="font-ravi">
            {t("comments.otpSentTo")} {pendingData?.phone}
            <p className="text-xs">پوشه‌ی اسپم را نیز چک کنید.</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="font-ravi">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-300 text-green-600 font-ravi">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>{t("comments.enterOtp")}</Label>
            <div className="flex justify-center font-ravi">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="flex gap-2 font-ravi">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("form")
                setOtpCode("")
                setError("")
                setSuccess("")
              }}
              className="flex-1"
            >
              {t("common.back")}
            </Button>
            <Button onClick={handleOTPSubmit} disabled={isLoading || otpCode.length !== 6} className="flex-1">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("comments.verify")}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto text-text_royal_green">
      <CardHeader className="gap-2 mb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t("comments.leaveComment")}
        </CardTitle>
        <CardDescription className="font-ravi text-xs">{isAuthenticated ? t("comments.authenticatedDesc") : t("comments.guestDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="font-ravi">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-300 text-green-600 font-ravi">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Guest Information - only show if not authenticated */}
          {!isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t("comments.fullName")}
                </Label>
                <Input id="fullname" className="font-ravi text-sm" {...register("fullname")} placeholder={t("comments.fullNamePlaceholder")} />
                {errors.fullname && <p className="text-sm font-ravi text-red-500">{errors.fullname.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t("comments.phoneNumber")}
                </Label>
                <Input id="phone" className="font-ravi text-sm" {...register("phone")} placeholder="09123456789" dir="ltr" />
                {errors.phone && <p className="text-sm font-ravi text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {t("comments.rating")} ({isRTL? formatCurrency(rating) : rating}/{isRTL? formatCurrency(10) : "10"})
            </Label>
            <div className="flex items-center gap-2">
              {renderStars()}
              <span className="text-sm font-ravi text-muted-foreground">
                {rating <= 3 && t("comments.ratingPoor")}
                {rating > 3 && rating <= 6 && t("comments.ratingGood")}
                {rating > 6 && rating <= 8 && t("comments.ratingVeryGood")}
                {rating > 8 && t("comments.ratingExcellent")}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">{t("comments.yourComment")}</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder={t("comments.commentPlaceholder")}
              rows={4}
              className="resize-none font-ravi text-sm"
            />
            {errors.comment && <p className="text-sm text-red-500">{errors.comment.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full font-ravi">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isAuthenticated ? t("comments.submitComment") : t("comments.submitWithVerification")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
