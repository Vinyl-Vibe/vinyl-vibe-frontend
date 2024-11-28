import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainNav from '../../components/layout/MainNav'
import { useProductStore } from '../../store/products'
import { Alert } from '../../components/ui/alert'
import { Button } from '../../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ProductDetailsSkeleton from '../../components/products/ProductDetailsSkeleton'

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, currentProduct, isLoading, error, fetchProduct, scrollPosition } = useProductStore()

  useEffect(() => {
    fetchProduct(id)
  }, [id, fetchProduct])

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div>
        <MainNav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-24">
            <Button
              variant="ghost"
              className="mb-8 flex items-center gap-2 opacity-50"
              disabled
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
            <div className="animate-in fade-in duration-300">
              <ProductDetailsSkeleton />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <MainNav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-24">
            <Alert variant="destructive">{error}</Alert>
          </div>
        </main>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div>
        <MainNav />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-24">
            <Alert>Product not found</Alert>
          </div>
        </main>
      </div>
    )
  }

  const { title, artist, price, imageUrl, genre, year, condition } = currentProduct

  return (
    <div>
      <MainNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-24 animate-in fade-in duration-500">
          <Button
            variant="ghost"
            className="mb-8 flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Button>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {artist && (
                <p className="mt-2 text-lg text-gray-500">{artist}</p>
              )}
              <p className="mt-4 text-2xl font-medium">${price}</p>

              {/* Product Details */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-lg font-medium">Details</h2>
                <dl className="mt-4 space-y-4">
                  {genre && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Genre</dt>
                      <dd className="mt-1">{genre}</dd>
                    </div>
                  )}
                  {year && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Year</dt>
                      <dd className="mt-1">{year}</dd>
                    </div>
                  )}
                  {condition && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Condition</dt>
                      <dd className="mt-1">{condition}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-8">
                <button
                  type="button"
                  className="w-full rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductPage 