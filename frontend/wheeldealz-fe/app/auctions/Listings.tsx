'use client';

import React from 'react';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import Filters from './Filters';
import EmptyFilter from '../components/EmptyFilter';
import { useAuctionsWithSearchParams } from '../hooks/useAuctionsWithSearchParams';

export default function Listings() {
  const { auctions, totalCount, pageCount, isLoading, setPageNumber, pageNumber } = useAuctionsWithSearchParams();

    if (isLoading) return <h3>Loading...</h3>;

    return (
        <>
            <Filters />
            {totalCount === 0 ? (
                <EmptyFilter showReset />
            ) : (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {auctions.map(auction => (
                            <AuctionCard auction={auction} key={auction.id} />
                        ))}
                    </div>
                    <div className='flex justify-center mt-4'>
                        <AppPagination 
                            pageChanged={setPageNumber} 
                            currentPage={pageNumber} // Ensure currentPage is properly managed
                            pageCount={pageCount} />
                    </div>
                </>
            )}
        </>
    );
}
