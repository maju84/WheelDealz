'use client';

import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useParamsStore } from '../hooks/useParamsStore';
import { usePathname, useRouter } from 'next/navigation';

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const { searchTerm, setParams } = useParamsStore(state => ({
        searchTerm: state.searchTerm,
        setParams: state.setParams
    }));
    const [inputValue, setInputValue] = useState(searchTerm); // Initialize with global searchTerm

    useEffect(() => {
        // Sync inputValue with global searchTerm when it changes
        setInputValue(searchTerm);
    }, [searchTerm]);
    
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value); // Update local state, not global
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') search();
    };

    const search = () =>{
        if (pathname !== '/') router.push('/'); // Redirect if not on home page
        setParams({ searchTerm: inputValue }); // Only update global state here
    };

  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
        <input 
            onKeyDown={handleKeyDown}
            onChange={onChange}
            value={inputValue} // Use local state value here
            type="text" 
            placeholder="Search for cars by make, model or color" 
            className='input-custom text-sm text-gray-600'
        />
        <button type="button" onClick={search}>   {/* just pass in the search function  */}
          <FaSearch size={38}
            className='bg-green-400 text-white rounded-full p-2 cursor-pointer mx-2' />
        </button>
    </div>
  );
}
