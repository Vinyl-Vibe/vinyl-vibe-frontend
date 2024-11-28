import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { SORT_OPTIONS, useProductStore } from '../../store/products'

function SortSelect() {
  const { sortBy, setSortBy } = useProductStore()

  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={SORT_OPTIONS.NEWEST}>Newest First</SelectItem>
        <SelectItem value={SORT_OPTIONS.PRICE_LOW}>Price: Low to High</SelectItem>
        <SelectItem value={SORT_OPTIONS.PRICE_HIGH}>Price: High to Low</SelectItem>
        <SelectItem value={SORT_OPTIONS.TITLE_AZ}>Title: A to Z</SelectItem>
        <SelectItem value={SORT_OPTIONS.TITLE_ZA}>Title: Z to A</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default SortSelect 