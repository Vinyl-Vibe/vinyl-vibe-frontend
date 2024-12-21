import { SearchX, PackageX, Users, ShoppingBag } from "lucide-react";

export function EmptyState({ type = "search" }) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background p-8 text-center animate-in fade-in-50">
            {type === "search" ? (
                <>
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No results found</h3>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters
                    </p>
                </>
            ) : type === "products" ? (
                <>
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No products found</h3>
                    <p className="text-sm text-muted-foreground">
                        Add some products to get started
                    </p>
                </>
            ) : type === "customers" ? (
                <>
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No customers found</h3>
                    <p className="text-sm text-muted-foreground">
                        Your customer list is empty
                    </p>
                </>
            ) : (
                <>
                    <PackageX className="h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No orders found</h3>
                    <p className="text-sm text-muted-foreground">
                        There are no orders with the selected status
                    </p>
                </>
            )}
        </div>
    );
}
