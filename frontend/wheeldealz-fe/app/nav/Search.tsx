import React from 'react';
import { FaSearch } from "react-icons/fa";

export default function Search() {
  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
        <input 
            type="text" 
            placeholder="Search for cars by make, model or color" 
            className='
                flex-grow pl-5 bg-transparent
                focus:outline-none focus:ring-0 focus:border-none 
                focus:ring-transparent border-transparent 
                text-sm text-gray-600'
        />
        <button>
          <FaSearch size={38}
            className='bg-green-400 text-white rounded-full p-2 cursor-pointer mx-2' />
        </button>
    </div>
  );
}