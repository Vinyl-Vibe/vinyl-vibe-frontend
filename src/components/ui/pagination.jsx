import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="flex items-center justify-center space-x-2 mt-8">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{/* Page numbers */}
			<div className="flex items-center space-x-1">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map(
					(pageNum) => (
						<Button
							key={pageNum}
							variant={
								pageNum === currentPage ? "default" : "outline"
							}
							size="sm"
							onClick={() => onPageChange(pageNum)}
						>
							{pageNum}
						</Button>
					)
				)}
			</div>

			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
export default Pagination;

