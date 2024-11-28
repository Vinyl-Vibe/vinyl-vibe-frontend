import { Button } from '../ui/button'
import { CATEGORIES, useProductStore } from '../../store/products'

function CategoryFilter() {
  const { activeCategory, setCategory } = useProductStore()

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(CATEGORIES).map(([key, value]) => (
        <Button
          key={value}
          variant={activeCategory === value ? 'default' : 'outline'}
          onClick={() => setCategory(value)}
        >
          {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
        </Button>
      ))}
    </div>
  )
}

export default CategoryFilter 