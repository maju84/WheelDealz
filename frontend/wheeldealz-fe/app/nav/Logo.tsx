'use client';

import React from 'react';
import { GiCarWheel } from 'react-icons/gi';
import { RiAuctionLine } from 'react-icons/ri';
import { useParamsStore } from '../hooks/useParamsStore';

export default function Logo() {
    const reset = useParamsStore(state => state.reset);
  return (
    <div onClick={reset}
        className='
            cursor-pointer flex items-center gap-2 text-3xl font-semibold text-green-500'>
        <GiCarWheel size={42}/>
        <div>WheelDealz</div>
        <RiAuctionLine size={42}/>
      </div>
  );
}
