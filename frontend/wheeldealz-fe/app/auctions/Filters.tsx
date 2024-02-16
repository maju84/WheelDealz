'use client';   // not really needed because the using component Listings is already declared client side

import { Button, ButtonGroup } from 'flowbite-react';
import React from 'react';
import { useParamsStore } from '../hooks/useParamsStore';

const pageSizeOptions = [4, 8, 16];

export default function Filters() {
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);

    
  return (
    <div className='flex justify-between items-center mb-4'>
        <div>
            <span className='uppercase text-sm text-gray-500 mr-2'>Page size</span> 
            <ButtonGroup>
                {pageSizeOptions.map((value, i) => (
                    <Button key={i} 
                            onClick={() => setParams({pageSize: value})}
                        color={`${pageSize === value ? 'green' : 'gray'}`}    // flowbite-react way to style the Button
                        className='focus:ring-2'
                    >
                        {value}
                    </Button>
                ))}
            </ButtonGroup>
        </div>

    </div>
  );
}
