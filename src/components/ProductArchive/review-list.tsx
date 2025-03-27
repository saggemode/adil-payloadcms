'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { IReviewDetails } from '@/types'
import { ReviewInputSchema } from '@/types/validator'
import { createUpdateReview, getReviewByProductId, getReviews } from '@/actions/reviewAction'
import RatingSummary from './rating-summary'
import { Product } from '@/payload-types'
import Rating from './rating'
import { useProductReviews, useUserReview, useCreateUpdateReview } from '@/hooks/useReviews'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: number | undefined
  product: Product
}) {
  const [page, setPage] = useState(2)
  const { data: reviewsData, isLoading: isLoadingReviews } = useProductReviews(
    product.id.toString(),
    page,
  )
  const { data: userReview } = useUserReview(product.id.toString())
  const createUpdateReviewMutation = useCreateUpdateReview()
  const { ref, inView } = useInView({ triggerOnce: true })

  const reload = async () => {
    // No need to manually reload as TanStack Query handles caching and refetching
  }

  const loadMoreReviews = async () => {
    const totalPages = reviewsData?.totalPages ?? 0
    if (totalPages !== 0 && page > totalPages) return
    setPage(page + 1)
  }

  useEffect(() => {
    if (inView) {
      // No need to manually load reviews as TanStack Query handles this
    }
  }, [inView])

  type CustomerReview = z.infer<typeof ReviewInputSchema>
  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    try {
      const res = await createUpdateReviewMutation.mutateAsync({
        data: { ...values, product: product.id },
        path: `/products/${product.slug}`,
      })

      if (!res.success) {
        return toast({
          variant: 'destructive',
          description: res.message,
        })
      }

      setOpen(false)
      toast({
        description: res.message,
      })
      // Reset page to 1 to show the new review
      setPage(1)
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to submit review',
      })
    }
  }

  const handleOpenForm = async () => {
    form.setValue('product', product.id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    if (userReview) {
      form.setValue('title', userReview.title)
      form.setValue('comment', userReview.comment)
      form.setValue('rating', userReview.rating)
    }
    setOpen(true)
  }

  const reviews = (reviewsData?.data || []).map((review) => ({
    ...review,
    id: String(review.id),
    product: String(review.product),
    user: {
      name:
        typeof review.user === 'object' && review.user !== null
          ? review.user.name || 'Anonymous'
          : 'Anonymous',
    },
    isVerifiedPurchase: Boolean(review.isVerifiedPurchase),
  }))
  const totalPages = reviewsData?.totalPages || 0

  return (
    <div className="space-y-2">
      {reviews.length === 0 && <div>No reviews yet</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={(product.ratingDistribution ?? []).map(({ rating, count }) => ({
                rating,
                count,
              }))}
            />
          )}
          <Separator className="my-3" />
          <div className="space-y-3">
            <h3 className="font-bold text-lg lg:text-xl">Review this product</h3>
            <p className="text-sm">Share your thoughts with other customers</p>
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button onClick={handleOpenForm} variant="outline" className=" rounded-full w-full">
                  Write a customer review
                </Button>

                <DialogContent className="sm:max-w-[425px]">
                  <Form {...form}>
                    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>Write a customer review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with other customers
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-5  ">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Enter comment" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a rating" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <SelectItem key={index} value={(index + 1).toString()}>
                                        <div className="flex items-center gap-1">
                                          {index + 1} <StarIcon className="h-4 w-4" />
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={createUpdateReviewMutation.isPending}
                        >
                          {createUpdateReviewMutation.isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                Please{' '}
                <Link
                  href={`/auth/login?callbackUrl=/product/${product.slug}`}
                  className="highlight-link"
                >
                  sign in
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-3 flex flex-col gap-3">
          {reviews.map((review: IReviewDetails) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex-between">
                  <CardTitle>{review.title}</CardTitle>
                  <div className="italic text-sm flex">
                    <Check className="h-4 w-4" /> Verified Purchase
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <Rating rating={review.rating} />
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {review.user ? review.user.name : 'Deleted User'}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {page <= totalPages && (
              <Button variant={'link'} onClick={loadMoreReviews}>
                See more reviews
              </Button>
            )}

            {page < totalPages && isLoadingReviews && 'Loading'}
          </div>
        </div>
      </div>
    </div>
  )
}
