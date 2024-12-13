import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	
	// Show max 5 pages with current page in the middle when possible
	let pagesToShow = pages;
	if (totalPages > 5) {
		const start = Math.max(1, currentPage - 2);
		const end = Math.min(totalPages, start + 4);
		pagesToShow = pages.slice(start - 1, end);
		
		// Add ellipsis if needed
		if (start > 1) {
			pagesToShow = [1, '...', ...pagesToShow];
		}
		if (end < totalPages) {
			pagesToShow = [...pagesToShow, '...', totalPages];
		}
	}

	return (
		<div className="mt-8 flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage - 1)}
				
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{pagesToShow.map((page, index) => (
				page === '...' ? (
					<span key={`ellipsis-${index}`} className="px-2">...</span>
				) : (
					<Button
						key={page}
						variant={currentPage === page ? "default" : "outline"}
						onClick={() => onPageChange(page)}
						className="min-w-[40px]"
					>
						{page}
					</Button>
				)
			))}

			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage + 1)}
				
				disabled={currentPage === totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}

export default Pagination;
