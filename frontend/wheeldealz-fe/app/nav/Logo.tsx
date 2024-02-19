'use client';

import React from 'react';
import { GiCarWheel } from 'react-icons/gi';
import { RiAuctionLine } from 'react-icons/ri';
import { useParamsStore } from '../hooks/useParamsStore';
import { usePathname, useRouter } from 'next/navigation';

export default function Logo() {
    const router = useRouter();
    const pathname = usePathname();
    const reset = useParamsStore(state => state.reset);

    const resetAndNavigateHome = () => {
        if (pathname !== '/') {
          router.push('/');            
        } 
        reset();
    };

  return (
    <div onClick={resetAndNavigateHome}
        className='
            cursor-pointer flex items-center gap-2 text-3xl font-semibold text-green-500'>
        <GiCarWheel size={42}/>
        <div>WheelDealz</div>
        <RiAuctionLine size={42}/>
      </div>
  );
}
