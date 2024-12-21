import { useEffect, useState } from "react";
import { useStoreManagement } from "../../store/store-management";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, Plus, X } from "lucide-react";
import AdminProductSheet from "@/components/products/AdminProductSheet";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminProductsPage() {
    const {
        products,
        isLoading,
        error,
        fetchProducts,
        loadMoreProducts,
        hasMoreProducts,
    } = useStoreManagement();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts({ isFiltering: Boolean(searchQuery) });
    }, [fetchProducts, searchQuery]);

    useEffect(() => {
        if (!products) return;

        let result = [...products];

        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    product.type.toLowerCase().includes(searchLower) ||
                    (product.brand || "").toLowerCase().includes(searchLower) ||
                    (product.albumInfo?.artist || "")
                        .toLowerCase()
                        .includes(searchLower),
            );
        }

        setFilteredProducts(result);
    }, [products, searchQuery]);

    if (error) return <div>Error: {error}</div>;

    const productsList = Array.isArray(filteredProducts)
        ? filteredProducts
        : [];

    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <Card className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="text-3xl font-medium">
                            Products
                        </CardTitle>
                        <CardDescription>
                            Manage and view all products in your store
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsCreating(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="rounded-xl pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">
                                        Clear search
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products Table */}
                    {isLoading && !products.length ? (
                        <TableSkeleton rowCount={8} />
                    ) : productsList.length > 0 ? (
                        <div className="rounded-xl border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Brand/Artist</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productsList.map((product) => (
                                        <TableRow key={product._id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {product.type}
                                            </TableCell>
                                            <TableCell>
                                                {product.type === "vinyl"
                                                    ? product.albumInfo?.artist
                                                    : product.brand || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {product.stock}
                                            </TableCell>
                                            <TableCell>
                                                ${product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant=""
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedProduct(
                                                            product,
                                                        )
                                                    }
                                                >
                                                    View/Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {productsList.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <EmptyState
                            type={searchQuery ? "search" : "products"}
                        />
                    )}

                    {/* Load More Button */}
                    {hasMoreProducts && !searchQuery && (
                        <div className="mt-4 flex justify-center">
                            <Button
                                onClick={loadMoreProducts}
                                disabled={isLoading}
                                variant="secondary"
                            >
                                {isLoading
                                    ? "Loading..."
                                    : "Load more products"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <AdminProductSheet
                product={selectedProduct}
                open={!!selectedProduct || isCreating}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedProduct(null);
                        setIsCreating(false);
                    }
                }}
                isCreating={isCreating}
            />
        </div>
    );
}
