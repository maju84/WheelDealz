'use server';

import { Auction, PagedResult } from "@/types";
import { fetchWrapper } from "../utils/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

const PAGE_SIZE_DEFAULT = 8;
const PAGE_NUMBER_DEFAULT = 1;
const QUERY_PARAMS_DEFAULT = new URLSearchParams({
  pageSize: PAGE_SIZE_DEFAULT.toString(),
  pageNumber: PAGE_NUMBER_DEFAULT.toString()
}).toString();

const SEARCH_ENDPOINT = 'search';
const AUCTIONS_ENDPOINT = 'auctions';
const BIDS_ENDPOINT = 'bids';

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
  return fetchWrapper.post({ url: AUCTIONS_ENDPOINT, body: data });
};

export const getAuctionDetails = async (id: string): Promise<Auction> => {
  return fetchWrapper.get({ url: `${AUCTIONS_ENDPOINT}/${id}` });
};

export const updateAuction = async (id: string, data: FieldValues) => {
  const res = fetchWrapper.put({ url: `${AUCTIONS_ENDPOINT}/${id}`, body: data });
  revalidatePath(`/auctions/${id}`);
  return res;
};

export const deleteAuction = async (id: string) => {
  return fetchWrapper.del({ url: `${AUCTIONS_ENDPOINT}/${id}` });
};


export const getBidsForAuction = async (auctionId: string) => {
  return fetchWrapper.get({ url: `${BIDS_ENDPOINT}/${auctionId}` });
};

export const placeBidForAuction = async (auctionId: string, amount: number) => {
  return fetchWrapper.post({ url: `${BIDS_ENDPOINT}?auctionId=${auctionId}&amount=${amount}`, body: {} });
};


export async function updateAuctionTest() {
  return fetchWrapper.put({
    url: `${AUCTIONS_ENDPOINT}/${TEST_AUCTION_ID}`,
    body: { mileage: Math.floor(Math.random() * 100000)+1 }
  });
}




