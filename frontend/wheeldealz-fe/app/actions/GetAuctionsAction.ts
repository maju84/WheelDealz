'use server';

import { Auction, PagedResult } from "@/types";
import { getTokenWorkaround } from "./AuthActions";

const PAGE_SIZE_DEFAULT = 8;
const PAGE_NUMBER_DEFAULT = 1;
const QUERY_PARAMS_DEFAULT = new URLSearchParams({
  pageSize: PAGE_SIZE_DEFAULT.toString(),
  pageNumber: PAGE_NUMBER_DEFAULT.toString()
}).toString();

const SEARCH_URL = 'http://localhost:6001/search';

const AUCTIONS_URL = 'http://localhost:6001/auctions';
const AUCTION_ID = 'afbee524-5972-4075-8800-7d1f9d7b0a0c'; // todo. (see AuctionSvc' DbInitializer)

export async function getPaginatedAuctionsFromSearch({ queryParams = QUERY_PARAMS_DEFAULT }: 
    { queryParams?: string }): Promise<PagedResult<Auction>> {

    // Ensure queryParams are encoded properly
    const encodedQueryParams = encodeURI(queryParams);
    console.log("Encoded query params:", encodedQueryParams);
    console.log("Fetching data from:", `${SEARCH_URL}?${encodedQueryParams}`);
    // Use template literals for URL construction
    const response = await fetch(`${SEARCH_URL}?${encodedQueryParams}`, 
      { cache: 'force-cache' });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}

export async function UpdateAuctionTest() {
  const data = {
    mileage: Math.floor(Math.random() * 100000)+1
  };

  const token = await getTokenWorkaround();

  const response = await fetch(`${AUCTIONS_URL}/${AUCTION_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token?.access_token
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
      return {status: response.status, message: response.statusText};
  }

  return response.statusText;
}
