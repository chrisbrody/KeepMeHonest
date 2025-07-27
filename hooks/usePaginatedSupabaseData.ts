// src/hooks/usePaginatedSupabaseData.ts (create this file)
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

interface FetchOptions {
    initialFetch?: boolean;
    chunkSize?: number;
    orderBy?: { column: string; ascending: boolean }[];
}

interface PaginatedDataResult<T> {
    data: T[];
    isLoading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
}

// Generic hook to fetch all data from a table using pagination
export function usePaginatedSupabaseData<T>(
    tableName: string,
    options: FetchOptions = {}
): PaginatedDataResult<T> {
    const { initialFetch = true, chunkSize = 1000, orderBy = [] } = options;

    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(initialFetch); // Only true initially if initialFetch is true
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching paginated data for table: ${tableName}`);

        let allItems: T[] = [];
        let currentOffset = 0;
        let fetchMore = true;
        let page = 1;

        // Ensure user is authenticated before fetching data from protected tables
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn(`usePaginatedSupabaseData: User not authenticated while trying to fetch from ${tableName}.`);
            setError("Authentication required.");
            setIsLoading(false);
            setData([]); // Clear data
            return; // Stop fetching
        }


        try {
            while (fetchMore) {
                const startIndex = currentOffset;
                const endIndex = currentOffset + chunkSize - 1;
                // console.log(`Fetching page ${page}: rows ${startIndex} to ${endIndex}`);

                let query = supabase.from(tableName).select('*').range(startIndex, endIndex);

                // Apply ordering
                orderBy.forEach(order => {
                    query = query.order(order.column, { ascending: order.ascending });
                });

                const { data: chunkData, error: chunkError } = await query;

                if (chunkError) {
                    console.error(`Supabase fetch error on page ${page} for ${tableName}:`, chunkError);
                    throw chunkError; // Stop fetching on error
                }

                // console.log(`Received ${chunkData ? chunkData.length : 0} items for page ${page}.`);

                if (chunkData && chunkData.length > 0) {
                    allItems = allItems.concat(chunkData as T[]); // Append fetched items
                    currentOffset += chunkData.length;
                    page++;
                    if (chunkData.length < chunkSize) {
                        fetchMore = false; // Last page fetched
                    }
                } else {
                    fetchMore = false; // No more data
                }
            }
            console.log(`Finished fetching for ${tableName}. Total items: ${allItems.length}`);
            setData(allItems); // Set the complete list

        } catch (err: any) {
            console.error(`Caught error during paginated fetch for ${tableName}:`, err);
            const errorMessage = err instanceof PostgrestError ? err.message : (err as Error)?.message || "Failed to fetch data.";
            setError(errorMessage);
            setData([]); // Clear data on error
        } finally {
            setIsLoading(false);
        }
    }, [tableName, chunkSize, orderBy, supabase]); // Include dependencies

    // Initial fetch on mount if enabled
    useEffect(() => {
        if (initialFetch) {
            fetchData();
        }
    }, [initialFetch, fetchData]); // Depend on fetchData callback

    return { data, isLoading, error, fetchData };
}