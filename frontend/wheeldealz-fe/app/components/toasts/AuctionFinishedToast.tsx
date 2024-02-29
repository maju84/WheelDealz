import { Auction, AuctionFinished } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { numberWithDots } from '@/app/utils/numberWithDots';

type Props = {
    finishedAuction: AuctionFinished
    auction: Auction
}

const AUCTION_DETAILS_ENDPOINT = '/auctions/details/';  // todo at least centralize this if not pulling out into config

export default function AuctionFinishedToast({ auction, finishedAuction }: Props) {
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

            <div className='flex flex-col'>
                <span>Auction for {auction.make} {auction.model} has finished.</span>
                { finishedAuction.itemSold && finishedAuction.amount ? (
                    <p>Congrats to { finishedAuction.winner } who has won this auction for
                     ${numberWithDots(finishedAuction.amount)}</p>
                ) : (
                    <p>The auction has ended without a winner.</p>
                )}
            </div>            
         </div>
        </Link>
      );
    }
