import React from 'react';
import AuctionCard from './AuctionCard';
import { Auction, PagedResult } from '@/types';


async function getData() : Promise<PagedResult<Auction>> {
  const response = await fetch("http://localhost:6001/search?pageSize=10");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export default async function Listings() {
  const data = await getData();
  
  return (
    <div className='grid grid-cols-4 gap-6'>
      {data && data.results.map(auction => (
        <AuctionCard auction={ auction } key={ auction.id } />
        ))}
    </div>
  );
}
