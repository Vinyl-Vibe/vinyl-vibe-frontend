import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
import { useProductStore } from "../../store/products";
import VinylVibeLogo from "@/assets/icons/vinyl_vibe-logo";
import { Button } from "../ui/button";
import { LibraryIcon, SearchIcon, ShoppingCart, User } from "lucide-react";
import { Input } from "../ui/input";

function MainNav({ children }) {
	const { isAuthenticated, isAdmin } = useAuthStore();
	const { profile } = useUserStore();
	console.log('MainNav profile:', profile);
	const { resetFilters, refreshProducts } = useProductStore();
	const location = useLocation();

	const handleCatalogClick = () => {
		resetFilters();
		refreshProducts();
	};

	const isCatalogPage = location.pathname === '/catalog';

	return (
		<nav className="flex justify-center fixed top-0 left-0 right-0 z-50 px-10">
			<div className="w-full max-w-7xl border px-6 backdrop-blur-[8px] h-20 bg-background/70 z-51">
				<div className="flex justify-between h-full">
					<div className="flex">
						<Link
							to="/"
							className="flex items-center pr-6 border-r"
						>
							<VinylVibeLogo
								fill="hsl(var(--foreground))"
								secondaryfill="hsl(var(--border))"
							/>
						</Link>
					</div>
					<div className="flex items-center space-x-3">
						<div className="border-l pl-6 h-full flex items-center space-x-3">
							<Input type="search" placeholder="Search" />
						</div>
						<div className="border-l pl-6 h-full flex items-center space-x-3">
							<Link
								to="/catalog"
								className="text-sm font-medium"
								onClick={handleCatalogClick}
							>
								<Button size="icon" variant={isCatalogPage ? "default" : "secondary"}>
									<LibraryIcon />
								</Button>
							</Link>
							<Button size="icon" variant="secondary">
								<ShoppingCart />
							</Button>
							{isAuthenticated ? (
								<>
									<Button variant="secondary">
										<User />
										{profile?.email 
											? `${profile.email}` 
											: 'My Account'}
									</Button>
								</>
							) : (
								<Link
									to="/auth"
									className="text-sm font-medium"
								>
									<Button size="icon" variant="secondary">
										<User />
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default MainNav;
