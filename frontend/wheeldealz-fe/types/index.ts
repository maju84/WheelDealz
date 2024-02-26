export type PagedResult<T> = {
    results: T[];
    pageCount: number;
    totalCount: number;

}

export type Auction = {
    reservePrice: number;
    seller: string;
    winner?: string;
    soldAmount: number;
    currentHighBid: number;
    createdAt: string;
    updatedAt: string;
    endsAt: string;
    status: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    imageUrl: string;
    id: string;
}


// todo - euse this type in useAuctionsWithSearchParams and  useParamsStore ?
export type SearchQueryParams = {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    orderBy?: string;
    filterBy?: string;
    seller?: string;
    winner?: string;
  };

  export type Bid = {
    id: string
    auctionId: string
    bidder: string
    bidTime: string
    amount: number
    bidStatus: string
  }