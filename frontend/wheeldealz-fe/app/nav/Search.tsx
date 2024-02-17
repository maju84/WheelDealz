'use client';

import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useParamsStore } from '../hooks/useParamsStore';

export default function Search() {
    const setParams = useParamsStore((state) => state.setParams);   
    const [searchTerm, setSearchTerm] = useState('');

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') search();
    };

    const search = () =>{
        setParams({searchTerm: searchTerm});
    };

  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
        <input 
            onKeyDown={handleKeyDown}
            onChange={onChange}
            type="text" 
            placeholder="Search for cars by make, model or color" 
            className='
                flex-grow pl-5 bg-transparent
                focus:outline-none focus:ring-0 focus:border-none 
                focus:ring-transparent border-transparent 
                text-sm text-gray-600'
        />
        <button type="button" onClick={search}>   {/* just pass in the search function  */}
          <FaSearch size={38}
            className='bg-green-400 text-white rounded-full p-2 cursor-pointer mx-2' />
        </button>
    </div>
  );
}
