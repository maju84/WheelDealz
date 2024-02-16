'use server';

import { Auction, PagedResult } from "@/types";

export async function getData(page: number = 1, pageSize: number = 4) : Promise<PagedResult<Auction>> {
    const response = await fetch(`http://localhost:6001/search?pageSize=${pageSize}&pageNumber=${page}`);

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return response.json();
}