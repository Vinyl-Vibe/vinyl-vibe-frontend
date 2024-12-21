import { ArrowUpDown, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";

export function SortButton({ label, direction = "none", onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-1 px-0 py-2 text-sm transition-colors ${direction !== "none" ? "font-medium" : ""} `}
        >
            {label}
            <span className="ml-2">
                {direction === "none" && (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                )}
                {direction === "asc" && <ArrowUp className="h-4 w-4 text-foreground" />}
                {direction === "desc" && <ArrowDown className="h-4 w-4 text-foreground" />}
            </span>
        </button>
    );
}
