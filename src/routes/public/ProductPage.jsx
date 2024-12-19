import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/products";
import { useCartStore } from "../../store/cart";
import MainNav from "../../components/navigation/store/StoreNav";
import { Button } from "../../components/ui/button";
import { Alert } from "../../components/ui/alert";
import { ArrowLeft, Loader2, Minus, Plus } from "lucide-react";
import ProductDetailsSkeleton from "../../components/products/ProductDetailsSkeleton";
import NumberFlow from "@number-flow/react";

function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentProduct, isLoading, error, fetchProduct } =
        useProductStore();
    const { addItem, isLoading: isAddingToCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct(id);
    }, [id, fetchProduct]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleAddToCart = async () => {
        try {
            await addItem(id, quantity);
            // Could add a toast notification here
        } catch (err) {
            console.error("Failed to add to cart:", err);
            // Could show error toast here
        }
    };

    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () =>
        setQuantity((prev) => Math.max(1, prev - 1));

    if (isLoading) {
        return (
            <div>
                <MainNav />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-24">
                        <ProductDetailsSkeleton />
                    </div>
                </main>
            </div>
        );
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
        );
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
        );
    }

    const { name, price, type, brand, albumInfo, thumbnail } = currentProduct;

    return (
        <>
            <MainNav />
            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-24 duration-500 animate-in fade-in">
                    <Button
                        variant=""
                        className="mb-8 flex items-center gap-2"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
                        {/* Product Image */}
                        <div className="w-fill h-fill aspect-square overflow-hidden rounded-lg border">
                            <img
                                src={thumbnail || "/missing_image.png"}
                                alt={name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {name}
                            </h1>
                            {albumInfo?.artist && (
                                <p className="mt-1 text-lg text-muted-foreground">
                                    {albumInfo.artist}
                                </p>
                            )}
                            <p className="mt-4 text-xl font-medium">${price}</p>

                            {/* Add to Cart Section */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant=""
                                        size="icon"
                                        onClick={decrementQuantity}
                                        disabled={
                                            quantity <= 1 || isAddingToCart
                                        }
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <NumberFlow
                                        value={quantity}
                                        className="w-10 text-center"
                                    />
                                    <Button
                                        variant=""
                                        size="icon"
                                        onClick={incrementQuantity}
                                        disabled={isAddingToCart}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    className="flex-1"
                                    variant="secondary"
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add to Cart"
                                    )}
                                </Button>
                            </div>

                            {/* Product Details */}
                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h2 className="mb-4 text-sm font-medium">
                                    Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm text-muted-foreground">
                                            Type
                                        </h3>
                                        <p className="mt-1 text-sm font-medium">
                                            {type}
                                        </p>
                                    </div>
                                    {brand && (
                                        <div>
                                            <h3 className="text-sm text-muted-foreground">
                                                Brand
                                            </h3>
                                            <p className="mt-1 text-sm font-medium">
                                                {brand}
                                            </p>
                                        </div>
                                    )}
                                    {albumInfo?.genre && (
                                        <div>
                                            <h3 className="text-sm text-muted-foreground">
                                                Genre
                                            </h3>
                                            <p className="mt-1 text-sm font-medium">
                                                {albumInfo.genre}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ProductPage;
