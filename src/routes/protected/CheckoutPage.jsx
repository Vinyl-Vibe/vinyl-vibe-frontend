import { useState } from "react";
import MainNav from "../../components/layout/MainNav";
import { useAuthStore } from "../../store/auth";
import { Alert } from "../../components/ui/alert";

/* 
    CheckoutPage: Protected route for checkout process
    - Shows cart summary
    - Initiates Stripe checkout session
    - Redirects to Stripe's hosted checkout page
    - Handles success/failure via webhook endpoints
*/
function CheckoutPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleCheckout() {
        setIsLoading(true);
        setError(null);

        try {
            // Create Stripe checkout session
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    // We'll add cart items here when we implement the cart
                    items: [],
                }),
            });

            const { url } = await response.json();

            // Redirect to Stripe checkout
            window.location.href = url;
        } catch (err) {
            setError("Failed to initiate checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <MainNav />
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold">Checkout</h1>
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
                    {/* Order Summary */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="text-lg font-medium">Order Summary</h2>
                        {/* Cart items will be added when we implement the cart */}
                        <div className="mt-6 border-t pt-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                {error}
                            </Alert>
                        )}
                        <button
                            className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
                            onClick={handleCheckout}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Redirecting..."
                                : "Proceed to Payment"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CheckoutPage;
