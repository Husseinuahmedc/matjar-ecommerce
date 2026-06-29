"use client"

import { useState, useTransition } from "react"
import { useLocale } from "next-intl"
import { Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createReview } from "@/actions/reviews"
import { Button, Textarea } from "@/components/ui/base"
import { toast } from "sonner"

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  orderId: string
  productName: string
}

export function ReviewModal({ open, onOpenChange, productId, orderId, productName }: ReviewModalProps) {
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const handleSubmit = () => {
    if (rating === 0) return

    startTransition(async () => {
      const result = await createReview({
        productId,
        orderId,
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      })

      if (result.success) {
        setSubmitted(true)
        toast.success(locale === "ar" ? "تم إرسال التقييم بنجاح" : "Review submitted successfully")
      } else {
        toast.error(result.error || (locale === "ar" ? "حدث خطأ ما" : "Something went wrong"))
      }
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    setRating(0)
    setTitle("")
    setBody("")
    setSubmitted(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 animate-in fade-in" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {locale === "ar" ? "تقييم المنتج" : "Review Product"}
            </h3>
            <button onClick={handleClose} className="p-1 hover:bg-secondary rounded-md transition-colors cursor-pointer" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3 fill-yellow-500" />
              <p className="font-medium">{locale === "ar" ? "تم التقييم ✓" : "Reviewed ✓"}</p>
              <p className="text-sm text-muted-foreground mt-1">{productName}</p>
              <Button className="mt-6" onClick={handleClose}>
                {locale === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{productName}</p>

              {/* Star Rating */}
              <div className="flex items-center gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors",
                        (hoverRating || rating) >= star
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-xs text-destructive text-center">
                  {locale === "ar" ? "يرجى اختيار تقييم" : "Please select a rating"}
                </p>
              )}

              {/* Title */}
              <div>
                <label className="text-sm font-medium">
                  {locale === "ar" ? "العنوان (اختياري)" : "Title (optional)"}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder={locale === "ar" ? "أضف عنواناً للتقييم" : "Add a title for your review"}
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-sm font-medium">
                  {locale === "ar" ? "التعليق (اختياري)" : "Comment (optional)"}
                </label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1 min-h-[100px]"
                  placeholder={locale === "ar" ? "شارك تجربتك مع هذا المنتج" : "Share your experience with this product"}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={handleClose}>
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleSubmit} disabled={rating === 0 || isPending}>
                  {isPending
                    ? (locale === "ar" ? "جاري الإرسال..." : "Submitting...")
                    : (locale === "ar" ? "إرسال التقييم" : "Submit Review")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
