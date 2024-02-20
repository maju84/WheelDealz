'use client';

import React from 'react';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import Filters from './Filters';
import { shallow } from 'zustand/shallow';
import { useParamsStore } from '../hooks/useParamsStore';
import EmptyFilters from '../components/EmptyFilters';
import { useAuctions } from '../hooks/useAuctions';



export default function Listings() {
  const pagedAuctions = useAuctions();
  
  // Here, we extract pageNumber directly from the global state, not from pagedAuctions
  const { pageNumber, setParams } = useParamsStore((state) => ({
    pageNumber: state.pageNumber,
    setParams: state.setParams
  }), shallow);

  function setPageNumber(page: number) {
    setParams({ pageNumber: page });  // Update pageNumber in the global state
  }

  // If the pagedAuctions are not yet fetched, display a loading message
  if (!pagedAuctions)  return <h3>Loading...</h3>;

  return (
    <>  {/* React fragment used as the single root element */}
      <Filters />
        {pagedAuctions.totalCount === 0 ? (
          <EmptyFilters showReset />
        ) : (
        <>
          <div className='grid grid-cols-4 gap-6'>
            {pagedAuctions.results.map(auction => (
              <AuctionCard auction={ auction } key={ auction.id } />
              ))}
          </div>
          <div className='flex justify-center mt-4'>
            <AppPagination 
              pageChanged={setPageNumber} 
              currentPage={pageNumber} 
              pageCount={pagedAuctions.pageCount} />
          </div>
        </>      
      )}
    </>    
  );
}
