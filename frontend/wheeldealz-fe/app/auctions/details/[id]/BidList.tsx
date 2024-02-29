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
    const isOpen = useBidsStore(state => state.isOpen);
    const setIsOpen = useBidsStore(state => state.setIsOpen);
    const setBids = useBidsStore(state => state.setBids);

    // Calculate highest bid amount from an array of bids where the bid status includes "Accepted".
    const highestBid = allBids.reduce((prev, current) => prev > current.amount
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

    
    // tl;dr - reset isOpen flag when the component unmounts
    useEffect(() => {
        // This setup code (if any) runs when the component mounts.
        // There's no direct setup action here, so it effectively does nothing on mount.    
        // The return statement defines a cleanup function...
        return () => setIsOpen(true); // ...which resets isOpen flag when the component unmounts
    }, [setIsOpen]); // Dependency array includes setIsOpen, but since setIsOpen is stable, the cleanup runs on unmount.
    


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
                        {allBids.map(bid => (
                            <BidItem key={bid.id} bid={bid} />
                        ))}
                    </>
                )}
            </div>

            <div className='px-2 pb-2 text-gray-500'>
                { !auction.status?.includes('Live') || !isOpen ? (    // fixme pretty brittle 
                    <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                        Auction has finished. Bidding is closed.
                    </div>
                ) : (
                    !user ? (
                        <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                            Please login to place a bid.
                        </div>
                        ) : user && user.username === auction.seller ? (
                            <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                                You cannot place a bid on your own auction.
                            </div>

                        ) : (
                            <BidForm auctionId={auction.id} highBid={highestBid} />
                        )
                    )}
                
            </div>
        </div>
    );

 }
