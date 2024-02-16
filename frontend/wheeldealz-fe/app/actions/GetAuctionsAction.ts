'use server';

import { Auction, PagedResult } from "@/types";

const PAGE_SIZE_DEFAULT = 8;
const PAGE_NUMBER_DEFAULT = 1;
const QUERY_PARAMS_DEFAULT = new URLSearchParams({
  pageSize: PAGE_SIZE_DEFAULT.toString(),
  pageNumber: PAGE_NUMBER_DEFAULT.toString()
}).toString();

const SEARCH_URL = 'http://localhost:6001/search';

export async function getPaginatedAuctionsFromSearch({ queryParams = QUERY_PARAMS_DEFAULT }: 
    { queryParams?: string }): Promise<PagedResult<Auction>> {

    // Ensure queryParams are encoded properly
    const encodedQueryParams = encodeURI(queryParams);
    console.log("Encoded query params:", encodedQueryParams);
    console.log("Fetching data from:", `${SEARCH_URL}?${encodedQueryParams}`);
    // Use template literals for URL construction
    const response = await fetch(`${SEARCH_URL}?${encodedQueryParams}`);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}
