import { useEffect } from 'react'
import MainNav from '../../components/layout/MainNav'
import ProductCard from '../../components/products/ProductCard'
import CategoryFilter from '../../components/products/CategoryFilter'
import SortSelect from '../../components/products/SortSelect'
import { useProductStore } from '../../store/products'
import { Alert } from '../../components/ui/alert'

/* 
  CatalogPage: Product listing page
  - Displays grid of ProductCards
  - Handles loading and error states
  - Will add filtering/sorting later
*/
function CatalogPage() {
  const { isLoading, error, fetchProducts, getFilteredProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = getFilteredProducts()

  return (
    <div>
      <MainNav />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-24">
          <h1 className="text-4xl font-bold tracking-tight">Our Collection</h1>
          
          {/* Filters and Sort */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <CategoryFilter />
            <SortSelect />
          </div>

          {error && (
            <Alert variant="destructive" className="mt-6">
              {error}
            </Alert>
          )}

          {isLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Add skeleton loading cards here */}
              Loading...
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CatalogPage 