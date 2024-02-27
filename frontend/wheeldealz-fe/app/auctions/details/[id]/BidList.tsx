'use client';

import { getBidsForAuction } from '@/app/actions/GetAuctionsAction';
import Heading from '@/app/components/Heading';
import { useBidsStore } from '@/app/hooks/useBidsStore';
import { Auction, Bid } from '@/types';
import { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import BidItem from './BidItem';
import { numberWithDots } from '@/app/utils/numberWithDots';
import EmptyFilter from '@/app/components/EmptyFilter';
import BidForm from './BidForm';

type BidsResponse = Bid[] | { error: string };  // todo - move to types ?

type Props = {    
    auction: Auction,
    user: Session['user'] | null
}

export default function BidList({ auction, user}: Props) {
    const [loading, setLoading] = useState(true);
    const allBids = useBidsStore(state => state.bids);
    const setBids = useBidsStore(state => state.setBids);

    // Filter bids for the current auction
    const bidsForCurrentAuction = allBids.filter(bid => bid.auctionId === auction.id);

    // Calculate highest bid amount from an array of bids where the bid status includes "Accepted".
    const highestBid = bidsForCurrentAuction.reduce((prev, current) => prev > current.amount
        ? prev
        : current.bidStatus.includes('Accepted')
            ? current.amount
            : prev, 
        0); // initial value for the highest amount is set to 0.

    useEffect(() => {
        getBidsForAuction(auction.id)
            .then((res: BidsResponse) => {
                if ('error' in res) {
                    throw new Error(res.error);
                }
                setBids(res as Bid[]);
            }).catch(err => {
                toast.error(err.message || 'Failed to load bids');
            }).finally(() => setLoading(false));
    }, [auction.id, setBids]);


    if (loading) return <span>Loading bids...</span>;

    return (
        <div className='rounded-lg shadow-md'>
            <div className='py-2 px-4 bg-white'>
                <div className='sticky top-0 bg-white p-2'>
                    <Heading title={`Highest Bid currently is $${numberWithDots(highestBid)}`} />
                </div>
            </div>

            <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
                {allBids.length === 0 ? (
                    <EmptyFilter title='No bids so far...' subtitle='Feel free to make a bid!' />
                ) : (
                    <>
                        {bidsForCurrentAuction.map(bid => (
                            <BidItem key={bid.id} bid={bid} />
                        ))}
                    </>
                )}
            </div>

            <div className='px-2 pb-2 text-gray-500'>
                {!user ? (
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Please login to place a bid.
                    </div>
                    ) : user && user.username === auction.seller ? (
                        <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                            You cannot place a bid on your own auction.
                        </div>

                    ) : (
                        <BidForm auctionId={auction.id} highBid={highestBid} />
                    )}
                
            </div>
        </div>
    );
}
