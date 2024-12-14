import { useState, useEffect } from 'react';

// Hook to ensure a minimum loading time
export function useMinimumLoadingTime(isLoading, minimumMs = 100) {
    const [isShowingLoader, setIsShowingLoader] = useState(isLoading);

    useEffect(() => {
        if (isLoading) {
            setIsShowingLoader(true);
        } else {
            const timer = setTimeout(() => {
                setIsShowingLoader(false);
            }, minimumMs);

            return () => clearTimeout(timer);
        }
    }, [isLoading, minimumMs]);

    return isShowingLoader;
} 