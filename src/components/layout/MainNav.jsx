import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useProductStore } from "../../store/products";
import VinylVibeLogo from "@/assets/icons/vinyl_vibe-logo";

function MainNav() {
	const { isAuthenticated, isAdmin } = useAuthStore();
	const { resetFilters, refreshProducts } = useProductStore();

	const handleCatalogClick = () => {
		resetFilters();
		refreshProducts();
	};

	return (
		<nav className="border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link to="/" className="flex items-center">
							<VinylVibeLogo fill="#09090B" secondaryfill="#DEDEDE" />
						</Link>
						<div className="ml-10 flex items-center space-x-4">
							<Link
								to="/catalog"
								className="text-sm font-medium"
								onClick={handleCatalogClick}
							>
								Catalog
							</Link>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						{isAdmin && (
							<Link to="/admin" className="text-sm font-medium">
								Dashboard
							</Link>
						)}
						{isAuthenticated ? (
							<>
								<Link
									to="/account"
									className="text-sm font-medium"
								>
									Account
								</Link>
								<button className="text-sm font-medium">
									Cart (0)
								</button>
							</>
						) : (
							<Link to="/auth" className="text-sm font-medium">
								Sign In
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default MainNav;
