export const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-gray-200 via-white to-gray-200" />
)

export const ProductCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg bg-white p-4">
    <div className="aspect-square w-full relative overflow-hidden bg-gray-100 rounded-lg">
      <Shimmer />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-4 w-3/4 bg-gray-100 rounded">
        <Shimmer />
      </div>
      <div className="h-4 w-1/2 bg-gray-100 rounded">
        <Shimmer />
      </div>
    </div>
  </div>
)

export const CategoryCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg bg-white p-4">
    <div className="h-32 bg-gray-100 rounded-lg">
      <Shimmer />
    </div>
    <div className="mt-2 h-4 w-1/2 bg-gray-100 rounded">
      <Shimmer />
    </div>
  </div>
)

export const FlashSaleSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg bg-white p-4">
    <div className="h-48 bg-gray-100 rounded-lg">
      <Shimmer />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-6 w-3/4 bg-gray-100 rounded">
        <Shimmer />
      </div>
      <div className="h-4 w-1/2 bg-gray-100 rounded">
        <Shimmer />
      </div>
    </div>
  </div>
)
