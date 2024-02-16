'use client';

import React, { useEffect, useState } from 'react';
import AuctionCard from './AuctionCard';
import AppPagination from '../components/AppPagination';
import { getPaginatedAuctionsFromSearch } from '../actions/GetAuctionsAction';
import { Auction, PagedResult } from '@/types';
import Filters from './Filters';
import { shallow } from 'zustand/shallow';
import { useParamsStore } from '../hooks/useParamsStore';

export default function Listings() {
  const [pagedAuctions, setPagedAuctions] = useState<PagedResult<Auction>>();
 
  // instead of getting entire state, we only get the elements we need
  // in order to avoid unnecessary rerenders. Plus ...
  const params = useParamsStore(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm
  }), shallow); // ... we use Zustand's shallow equality check

  // to update the state, we only need the setParams function
  const setParams = useParamsStore(state => state.setParams);

   // Function to construct the query URL
   const constructQueryString = (params) => {
    const searchParams = new URLSearchParams();
    searchParams.set('pageNumber', params.pageNumber.toString());
    searchParams.set('pageSize', params.pageSize.toString());
    if (params.searchTerm) {
      searchParams.set('searchTerm', params.searchTerm);
    }
    return searchParams.toString();
  };
  const queryParams = constructQueryString(params);

  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber });  // update the state of the useParamsStore with the new pageNumber
  }
  

  useEffect(() => {
    // Fetch the auctions from the server
    getPaginatedAuctionsFromSearch({ queryParams: queryParams })
      // Update the state with the fetched auctions
      .then(pagedAuctions => {
        setPagedAuctions(pagedAuctions);
      });
  }, [queryParams]); // call this useEffect when the query parameters change

  // If the pagedAuctions are not yet fetched, display a loading message
  if (!pagedAuctions)  return <h3>Loading...</h3>;

  
  return (
    <>  {/* React fragment used as the single root element */}
      <Filters />
      <div className='grid grid-cols-4 gap-6'>
        {pagedAuctions.results.map(auction => (
          <AuctionCard auction={ auction } key={ auction.id } />
          ))}
      </div>
      <div className='flex justify-center mt-4'>
        <AppPagination 
          pageChanged={setPageNumber} 
          currentPage={params.pageNumber} 
          pageCount={pagedAuctions.pageCount} />
      </div>
    </>
    
  );
}
