'use client';

import React, { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import { getPaginatedAuctionsFromSearch } from '../actions/GetAuctionsAction';
import { Auction } from '@/types';
import Filters from './Filters';


export default function Listings() { 
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    getPaginatedAuctionsFromSearch({ page: page, pageSize: pageSize }).then(data => {
    setAuctions(data.results);
    setPageCount(data.pageCount);
  });
  }, [page, pageSize]); // re-run when page changes, causes rerender

  if (auctions.length === 0) {
    return <h3>Loading...</h3>;
  }
  
  return (
    <>  {/* React fragment used as the single root element */}
      <Filters pageSize={ pageSize } setPageSize={ setPageSize } />
      <div className='grid grid-cols-4 gap-6'>
        {auctions.map(auction => (
          <AuctionCard auction={ auction } key={ auction.id } />
          ))}
      </div>
      <div className='flex justify-center mt-4'>
        <AppPagination pageChanged={setPage} currentPage={page} pageCount={pageCount} />
      </div>
    </>
    
  );
}
