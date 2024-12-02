import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useProductStore } from "../../store/products";
import VinylVibeLogo from "@/assets/icons/vinyl_vibe-logo";
import { Button } from "../ui/button";
import { LibraryIcon, SearchIcon, ShoppingCart, User } from "lucide-react";
import { Input } from "../ui/input";

function MainNav({ children }) {
	const { isAuthenticated, isAdmin } = useAuthStore();
	const { resetFilters, refreshProducts } = useProductStore();

	const handleCatalogClick = () => {
		resetFilters();
		refreshProducts();
	};

	return (
		<>
			<nav className="fixed top-0 w-full z-50 px-10">
				<div className="max-w-7xl border mx-auto px-6 backdrop-blur-[8px] h-20 bg-background/70 z-51">
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
									<Button size="icon" variant="secondary">
										<LibraryIcon />
									</Button>
								</Link>
								<Button size="icon" variant="secondary">
									<ShoppingCart />
								</Button>
								{isAuthenticated ? (
									<>
										<Button size="icon" variant="secondary">
											<User />
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
			<div className="">
				{children}
			</div>
		</>
	);
}

export default MainNav;
