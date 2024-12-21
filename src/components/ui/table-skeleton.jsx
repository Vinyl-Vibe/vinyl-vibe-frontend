export function TableSkeleton({ rowCount = 5 }) {
    return (
        <div className="rounded-xl border">
            <div className="divide-y">
                {/* Header */}
                <div className="grid grid-cols-6 gap-4 bg-muted/5 p-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={`header-${i}`}
                            className="h-6 animate-pulse rounded-md bg-slate-200"
                        />
                    ))}
                </div>

                {/* Rows */}
                {[...Array(rowCount)].map((_, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className="grid grid-cols-6 gap-4 p-4"
                    >
                        {[...Array(6)].map((_, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className="h-5 animate-pulse rounded-md bg-slate-200"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
