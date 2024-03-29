'use client';   // not really needed because the using component Listings is already declared client side

import { Button, ButtonGroup } from 'flowbite-react';
import React from 'react';
import { useParamsStore } from '../hooks/useParamsStore';
import { AiFillStar, AiOutlineClockCircle, AiOutlineSortAscending } from 'react-icons/ai';
import { GiFinishLine } from 'react-icons/gi';
import { FaFlagCheckered } from 'react-icons/fa';
import { MdGavel } from 'react-icons/md';

const pageSizeOptions = [4, 8, 16];

const orderButtons = [
    { label: 'Make', icon: AiOutlineSortAscending, value: 'make' },
    { label: 'End date', icon: AiOutlineClockCircle, value: 'endsAt' }, // default case ('_') in SearchSvc::SearchController
    { label: 'Recently added', icon: AiFillStar, value: 'new' },
];

const filterButtons = [
    { label: 'LiveAuctions', icon: MdGavel, value: 'live' },          // default case in SearchSvc::SearchController
    { label: 'Ending soon', icon: GiFinishLine, value: 'endingSoon' }, 
    { label: 'Finished', icon: FaFlagCheckered, value: 'finished' },
];

export default function Filters() {
    const pageSize = useParamsStore(state => state.pageSize);
    const setParams = useParamsStore(state => state.setParams);
    const orderBy = useParamsStore(state => state.orderBy);
    const filterBy = useParamsStore(state => state.filterBy);

    
  return (
    <div className='flex justify-between items-center mb-4'>

        <div>
            <span className='uppercase text-sm text-gray-500 mr-2'>Filter by</span>
            <ButtonGroup>
                {filterButtons.map(({ label, icon: Icon, value }) => (
                    <Button key={value}
                        onClick={() => setParams({ filterBy: value })}
                        color={`${filterBy === value ? 'green' : 'gray'}`}
                        className='focus:ring-2'
                    >
                        <Icon className='mr-1 h-4 w-4'/>
                        {label}
                    </Button>
                ))}
            </ButtonGroup>
        </div>

        <div>
            <span className='uppercase text-sm text-gray-500 mr-2'>Order by</span>
            <ButtonGroup>
                {orderButtons.map(({ label, icon: Icon, value }) => (
                    <Button key={value}
                        onClick={() => setParams({ orderBy: value })}
                        color={`${orderBy === value ? 'green' : 'gray'}`}
                        className='focus:ring-2'
                    >
                        <Icon className='mr-1 h-4 w-4'/>
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
