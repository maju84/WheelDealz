'use server';

import { Auction, PagedResult } from "@/types";

export async function getPaginatedAuctionsFromSearch({ page = 1, pageSize = 4 }: 
    { page?: number; pageSize?: number }): Promise<PagedResult<Auction>> {
    const response = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${page}`);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}