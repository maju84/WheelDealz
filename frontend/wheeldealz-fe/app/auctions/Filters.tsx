'use client';   // not really needed because the using component Listings is already declared client side

import { Button, ButtonGroup } from 'flowbite-react';
import React from 'react';
import { useParamsStore } from '../hooks/useParamsStore';
import { AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { BsFillStopCircleFill } from 'react-icons/bs';

const pageSizeOptions = [4, 8, 16];

const orderButtons = [
    { label: 'Make', icon: AiOutlineSortAscending, value: 'make' },
    { label: 'End date', icon: AiOutlineClockCircle, value: 'endsAt' }, // default case in SearchSvc::SerachController
    { label: 'Recently added', icon: BsFillStopCircleFill, value: 'new' },
];

export default function Filters() {
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);

    
  return (
    <div className='flex justify-between items-center mb-4'>

        <div>
            <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
            <ButtonGroup>
                {orderButtons.map(({ label, icon: Icon, value }) => (
                    <Button key={value}
                        onClick={() => setParams({ orderBy: value })}
                        color={`${orderBy === value ? 'green' : 'gray'}`}
                        className='focus:ring-2'
                    >
                        <Icon className='mr-3 h-4 w-4'/>
                        {label}
                    </Button>
                ))}
            </ButtonGroup>
        </div>

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
