import { useEffect } from 'react';
import { useAuctionsStore } from './useAuctionsStore';
import { useParamsStore } from './useParamsStore';
import { getPagedAuctionsFromSearch } from '../actions/GetAuctionsAction';
import { shallow } from 'zustand/shallow';
import { constructQueryString } from '../utils/constructQueryString';

export const useAuctionsWithSearchParams = () => {
    // Extracting state from useParamsStore
    const searchParams = useParamsStore(state => ({
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      searchTerm: state.searchTerm,
      orderBy: state.orderBy,
      filterBy: state.filterBy,
      seller: state.seller,
      winner: state.winner,
  }), shallow); // Ensure shallow is imported correctly

  // Extracting the action separately from useParamsStore
  const setParams = useParamsStore(state => state.setParams);

  const { auctions, totalCount, pageCount, isLoading, setData, setLoading } = useAuctionsStore(state => ({
      auctions: state.auctions,
      totalCount: state.totalCount,
      pageCount: state.pageCount,
      isLoading: state.isLoading,
      setData: state.setPagedAuctions,
      setLoading: state.setLoading,
  }));

  // Function to update pageNumber, directly using setParams from useParamsStore
  const setPageNumber = (newPageNumber: number) => {
      setParams({ pageNumber: newPageNumber });
  };

    useEffect(() => {
        setLoading(true);
        const queryString = constructQueryString(searchParams);
        getPagedAuctionsFromSearch({ queryParams: queryString })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch paginated auctions:', error);
                setLoading(false);
            });
    }, [searchParams, setData, setLoading, setParams]);

    return {
        auctions,
        totalCount,
        pageCount,
        isLoading,
        setPageNumber,
        pageNumber: searchParams.pageNumber
    };
};