import { Auction, PagedResult } from "@/types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type State = {
    auctions: Auction[]
    totalCount: number
    pageCount: number
    isLoading: boolean
}

type Actions = {
    setPagedAuctions: (data: PagedResult<Auction>) => void
    setCurrentPrice: (auctionId: string, amount: number) => void
    setLoading: (isLoading: boolean) => void
}

const initialState: State = {
    auctions: [],
    pageCount: 0,
    totalCount: 0,
    isLoading: true
};

export const useAuctionsStore = createWithEqualityFn<State & Actions>((set) => ({
    ...initialState,

    setPagedAuctions: (data: PagedResult<Auction>) => {
        set(() => ({
            auctions: data.results,
            totalCount: data.totalCount,
            pageCount: data.pageCount
        }));
    },

    setCurrentPrice: (auctionId: string, amount: number) => {
        set((state) => ({
            auctions: state.auctions.map((auction) => auction.id === auctionId 
                ? {...auction, currentHighBid: amount} : auction)
        }));
    },

    setLoading: (isLoading: boolean) => {
        set(() => ({ isLoading }));
    },

}), shallow);