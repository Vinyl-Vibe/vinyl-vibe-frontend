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
import { format } from "date-fns";
import { Search, ArrowUpDown, Plus } from "lucide-react";
import AdminProductSheet from "@/components/products/AdminProductSheet";

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

    console.log("Products from store:", products);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (error) return <div>Error: {error}</div>;

    const productsList = Array.isArray(products) ? products : [];
    console.log("ProductsList:", productsList);

    return (
        <div className="py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Products</CardTitle>
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
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Type</TableHead>
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
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant=""
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedProduct(product)
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

                    {/* Load More Button */}
                    {hasMoreProducts && (
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
