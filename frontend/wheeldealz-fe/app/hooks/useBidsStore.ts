import { Bid } from "@/types";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type State = {
    bids: Bid[],
    isOpen: boolean
}

type Actions = {
    setBids: (bids: Bid[]) => void
    addBid: (bid: Bid) => void
    setIsOpen: (isOpen: boolean) => void
}

export const useBidsStore = createWithEqualityFn<State & Actions>((set) => ({
    bids: [],
    isOpen: true,

    setBids: (bids: Bid[]) => {
        set(() => ({
            bids
        }));
    },

    addBid: (bid: Bid) => {
        set(state => {
            // Check if the bid already exists to prevent duplicates
            const bidExists = state.bids.some(x => x.id === bid.id);
            return {
                // If the bid doesn't exist, prepend it; otherwise, keep the bids unchanged
                bids: bidExists ? state.bids : [bid, ...state.bids]
            };
        });
    },

    setIsOpen: (isOpen: boolean) => {
        set(() => ({
            isOpen: isOpen
        }));
    },
    
}), shallow);