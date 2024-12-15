import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "../../store/cart";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { productsApi } from "../../api/products";

function CartItem({ item }) {
    const { debouncedUpdateQuantity, removeItem } = useCartStore();
    const { product, quantity } = item;
    const [fullProduct, setFullProduct] = useState(product);

    // Fetch full product details whenever product ID changes
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const details = await productsApi.getProduct(product._id);
                setFullProduct(details);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
                // Fallback to existing product data if fetch fails
                setFullProduct(product);
            }
        };

        fetchProductDetails();
    }, [product._id]);

    return (
        <div className="flex p-6">
            {/* Product image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                    src={fullProduct.thumbnail || "/missing_image.png"}
                    alt={fullProduct.name}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            {/* Product details */}
            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium">
                    <h3 className="text-sm">{fullProduct.name}</h3>
                    <p className="ml-4">${fullProduct.price}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    {fullProduct.albumInfo?.artist || fullProduct.brand}
                </p>

                {/* Quantity controls */}
                <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant=""
                            size="icon"
                            onClick={() => debouncedUpdateQuantity(fullProduct._id, quantity - 1)}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <NumberFlow
                            value={quantity}
                            className="w-8 text-center text-base"
                        />
                        <Button
                            variant=""
                            size="icon"
                            onClick={() => debouncedUpdateQuantity(fullProduct._id, quantity + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        variant=""
                        size="icon"
                        className="text-destructive hover:border-destructive/20 hover:bg-destructive/10"
                        onClick={() => removeItem(fullProduct._id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
