"use client"

import { useAuth } from "@/contexts/AuthContext"
import CommentsSection from "@/components/comments/comments-section"
import { useLanguage } from "@/contexts/LanguageContext"
import { getTranslations } from "@/lib/i18n"
import { MessageCircle } from "lucide-react"

export default function Comments() {
  const { guest, isAuthenticated } = useAuth()
  const { t } = useLanguage()
//   const t = getTranslations(language)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8" />
            {t("comments.pageTitle")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("comments.pageDescription")}</p>
        </div>

        <CommentsSection
          isAuthenticated={isAuthenticated}
          guestData={
            guest
              ? {
                  id: guest.id,
                  fullname: guest.fullname,
                  phone: guest.phone,
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
