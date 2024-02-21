// useAuctions.ts
import { useState, useEffect } from 'react';
import { Auction, PagedResult } from '@/types';
import { useParamsStore } from '../hooks/useParamsStore';
import { shallow } from 'zustand/shallow';
import { constructQueryString } from '../utils/constructQueryString';
import { getPagedAuctionsFromSearch } from '../actions/GetAuctionsAction';

export const useAuctions = () => {
    // State hook to manage the fetched auction data. Initially set to null indicating data has not been fetched yet.
    const [pagedAuctions, setPagedAuctions] = useState<PagedResult<Auction> | null>(null);

  // Using useParamsStore to subscribe to relevant parts of the global state.
  // This hook will re-run whenever any of these parameters change, due to the shallow comparison.
  const searchParams = useParamsStore(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy,
    seller: state.seller,
    winner: state.winner,
  }), shallow);

  useEffect(() => {
    // Construct the query string from the current state of search parameters.
    const queryParams = constructQueryString(searchParams);

    // Fetch paginated auction data based on the current search parameters.
    getPagedAuctionsFromSearch({ queryParams })
      .then(response => {
        // Update local state with fetched data.
        setPagedAuctions(response);
      })
      .catch(error => {
        console.error('Failed to fetch paginated auctions:', error);
        // Optionally handle errors, such as setting an error state or logging.
      });

    // Adding queryParams as a dependency ensures this effect runs anytime the query parameters change.
  }, [searchParams]); // Ensure queryParams is correctly recalculated by useEffect's dependency array.

  return pagedAuctions;
};
