'use server';

import { Auction, PagedResult } from "@/types";
import { fetchWrapper } from "../utils/fetchWrapper";
import { FieldValues } from "react-hook-form";

const PAGE_SIZE_DEFAULT = 8;
const PAGE_NUMBER_DEFAULT = 1;
const QUERY_PARAMS_DEFAULT = new URLSearchParams({
  pageSize: PAGE_SIZE_DEFAULT.toString(),
  pageNumber: PAGE_NUMBER_DEFAULT.toString()
}).toString();

const SEARCH_ENDPOINT = 'search';
const AUCTION_ENDPOINT = 'auctions';

const TEST_AUCTION_ID = 'afbee524-5972-4075-8800-7d1f9d7b0a0c'; // todo. (see AuctionSvc' DbInitializer)

export const getPagedAuctionsFromSearch = async ({ queryParams = QUERY_PARAMS_DEFAULT }:
  { queryParams?: string }): Promise<PagedResult<Auction>> => {
    const encodedQueryParams = encodeURI(queryParams);

    try {
      const response = await fetchWrapper.get({ url: `${SEARCH_ENDPOINT}?${encodedQueryParams}` });
      return response as PagedResult<Auction>;
  } catch (error) {
      console.error('Error fetching paged auctions:', error);
      throw error;
  }
};

export const createAuction = async (data: FieldValues) => {   // todo i don't like this type *here*
  return fetchWrapper.post({ url: AUCTION_ENDPOINT, body: data });
};

export async function updateAuctionTest() {
  return fetchWrapper.put({
    url: `${AUCTION_ENDPOINT}/${TEST_AUCTION_ID}`,
    body: { mileage: Math.floor(Math.random() * 100000)+1 }
  });
}
