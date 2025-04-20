'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, ChevronDown, Filter, StarIcon, ThumbsUp, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

// Sorting options for reviews
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rating' },
  { value: 'lowest', label: 'Lowest Rating' },
  { value: 'helpful', label: 'Most Helpful' },
]

// Filter options for reviews
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Reviews' },
  { value: 'verified', label: 'Verified Purchases Only' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
]

// Review skeleton component for loading state
const ReviewSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-3/4 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </CardContent>
  </Card>
)

export default function ReviewList({
  userId,
  product,
}: {
  userId: number | undefined
  product: Product
}) {
  const [page, setPage] = useState(1)
  const [sortOption, setSortOption] = useState<string>('newest')
  const [filterOption, setFilterOption] = useState<string>('all')
  const { data: reviewsData, isLoading: isLoadingReviews } = useProductReviews(
    product.id.toString(),
    page,
  )
  const { data: userReview } = useUserReview(product.id.toString())
  const createUpdateReviewMutation = useCreateUpdateReview()
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.5 })
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (inView && !isLoadingReviews) {
      loadMoreReviews()
    }
  }, [inView])

  const loadMoreReviews = () => {
    const totalPages = reviewsData?.totalPages ?? 0
    if (totalPages !== 0 && page >= totalPages) return
    setPage(prev => prev + 1)
  }

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
      form.reset(reviewFormDefaultValues)
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

  const handleMarkHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }))
    toast({
      description: helpfulReviews[reviewId] 
        ? "Removed as helpful" 
        : "Marked as helpful. Thanks for your feedback!",
    })
  }

  // Process and filter reviews
  const allReviews = (reviewsData?.data || []).map((review) => ({
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

  // Apply filtering
  let filteredReviews = [...allReviews]
  if (filterOption === 'verified') {
    filteredReviews = filteredReviews.filter(review => review.isVerifiedPurchase)
  } else if (['5', '4', '3', '2', '1'].includes(filterOption)) {
    filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterOption))
  }

  // Apply sorting
  switch (sortOption) {
    case 'oldest':
      filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'highest': 
      filteredReviews.sort((a, b) => b.rating - a.rating)
      break
    case 'lowest':
      filteredReviews.sort((a, b) => a.rating - b.rating)
      break
    case 'helpful':
      filteredReviews.sort((a, b) => (helpfulReviews[b.id] ? 1 : 0) - (helpfulReviews[a.id] ? 1 : 0))
      break
    default: // newest
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const totalPages = reviewsData?.totalPages || 0
  const hasReviews = filteredReviews.length > 0

  return (
    <div className="space-y-4" id="reviews">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left sidebar with rating summary and review button */}
        <div className="flex flex-col gap-4">
          {hasReviews ? (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={(product.ratingDistribution ?? []).map(({ rating, count }) => ({
                rating,
                count,
              }))}
            />
          ) : (
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-muted-foreground">No reviews yet</p>
              <p className="text-sm mt-1">Be the first to review this product</p>
            </div>
          )}
          
          <Separator className="my-3" />
          
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Review this product</h3>
            <p className="text-sm text-muted-foreground">Share your thoughts with other customers</p>
            
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button 
                  onClick={handleOpenForm} 
                  variant="outline" 
                  className="rounded-full w-full"
                  size="lg"
                >
                  {userReview ? 'Edit your review' : 'Write a customer review'}
                </Button>

                <DialogContent className="sm:max-w-[500px]">
                  <Form {...form}>
                    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>{userReview ? 'Edit your review' : 'Write a customer review'}</DialogTitle>
                        <DialogDescription>
                          Your review helps other shoppers make better decisions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-5">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Overall Rating</FormLabel>
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

                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Review Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="What's most important to know?" {...field} />
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
                                <FormLabel>Review Details</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="What did you like or dislike? What did you use this product for?" 
                                    {...field} 
                                    className="h-32"
                                  />
                                </FormControl>
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
                          {createUpdateReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="text-center p-4 bg-muted rounded-md">
                Please{' '}
                <Link
                  href={`/auth/login?callbackUrl=/product/${product.slug}`}
                  className="highlight-link font-medium"
                >
                  sign in
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>

        {/* Right section with reviews list */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Filter and sort controls */}
          {hasReviews && (
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <div className="flex gap-2 items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter className="h-4 w-4" />
                      {FILTER_OPTIONS.find(option => option.value === filterOption)?.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {FILTER_OPTIONS.map(option => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => setFilterOption(option.value)}
                        className={filterOption === option.value ? "bg-accent" : ""}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      {SORT_OPTIONS.find(option => option.value === sortOption)?.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {SORT_OPTIONS.map(option => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => setSortOption(option.value)}
                        className={sortOption === option.value ? "bg-accent" : ""}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {isLoadingReviews && !hasReviews ? (
            <div className="space-y-4">
              <ReviewSkeleton />
              <ReviewSkeleton />
              <ReviewSkeleton />
            </div>
          ) : hasReviews ? (
            <div className="space-y-4">
              {filteredReviews.map((review: IReviewDetails) => (
                <Card key={review.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Rating rating={review.rating} />
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Check className="h-3 w-3" /> Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2 text-base">{review.comment}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        {review.user ? review.user.name : 'Deleted User'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleMarkHelpful(review.id)}
                    >
                      <ThumbsUp className={`mr-1 h-3 w-3 ${helpfulReviews[review.id] ? 'fill-primary' : ''}`} />
                      {helpfulReviews[review.id] ? 'Helpful' : 'Mark as helpful'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {/* Load more reviews */}
              <div ref={ref} className="py-4 text-center">
                {page < totalPages && (
                  <div className="flex justify-center">
                    {isLoadingReviews ? (
                      <Skeleton className="h-10 w-32" />
                    ) : (
                      <Button variant="outline" onClick={loadMoreReviews}>
                        Load more reviews
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
              <p className="text-lg font-medium mb-2">No reviews yet</p>
              <p className="text-muted-foreground text-center mb-4">
                Be the first to share your experience with this product
              </p>
              {userId && (
                <Button onClick={handleOpenForm} variant="default">
                  Write a Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
