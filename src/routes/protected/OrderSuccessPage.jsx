import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cart'
import { ordersApi } from '../../api/orders'
import MainNav from '../../components/layout/MainNav'
import { Button } from '../../components/ui/button'
import { CheckCircle2 } from 'lucide-react'

function OrderSuccessPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { clearCart } = useCartStore()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        // Clear cart on success page load
        clearCart()
    }, [clearCart])

    return (
        <>
            <MainNav />
            <main className="mx-auto w-full max-w-7xl pb-6 pt-[calc(5rem-1px)]">
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <h1 className="text-2xl font-medium">Order Confirmed!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. You will receive an email confirmation shortly.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate('/products')}
                        >
                            Continue Shopping
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={() => navigate('/orders')}
                        >
                            View Order
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default OrderSuccessPage 