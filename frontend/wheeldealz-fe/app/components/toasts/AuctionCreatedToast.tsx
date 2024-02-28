import { Auction } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type Props = {
    auction: Auction
}

const AUCTION_DETAILS_ENDPOINT = '/auctions/details/';  // todo at least centralize this if not pulling out into config

export default function AuctionCreatedToast({ auction }: Props) {
  return (
    <Link href={`${AUCTION_DETAILS_ENDPOINT}${auction.id}`} className='flex flex-col items-center'>
        <div className='flex flex-row items-center gap-2'>
            <Image
                src={ auction.imageUrl }
                alt='auction-image'
                height={80}
                width={80}
                className='rounded-lg w-auto h-auto'
            />        
        <span>New Auction! {auction.make} {auction.model} has been added.</span>
     </div>
    </Link>
  );
}
