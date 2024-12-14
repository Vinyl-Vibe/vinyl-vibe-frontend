import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "../../store/cart";
import NumberFlow from "@number-flow/react";

function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCartStore();
    const { product, quantity } = item;

    return (
        <div className="flex p-6">
            {/* Product image */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                <img
                    src={product.thumbnail || "/missing_image.png"}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            {/* Product details */}
            <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium">
                    <h3 className="text-sm">{product.name}</h3>
                    <p className="ml-4">${product.price}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                    {product.albumInfo?.artist || product.brand}
                </p>

                {/* Quantity controls */}
                <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                updateQuantity(product._id, quantity - 1)
                            }
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <NumberFlow value={quantity} className="w-8 text-center text-base" />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                                updateQuantity(product._id, quantity + 1)
                            }
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(product._id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
