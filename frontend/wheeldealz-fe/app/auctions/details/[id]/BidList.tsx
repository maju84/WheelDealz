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

type BidsResponse = Bid[] | { error: string };  // todo - move to types ?

type Props = {
    user: Session['user'] | null
    auction: Auction
}

export default function BidList({ auction }: Props) {
    const [loading, setLoading] = useState(true);
    const bids = useBidsStore(state => state.bids);
    const setBids = useBidsStore(state => state.setBids);

    // Calculates the highest bid amount from an array of bids where the bid status includes "Accepted".
    const highBid = bids.reduce((prev, current) => prev > current.amount
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
                    <Heading title={`Current high bid is $${numberWithDots(highBid)}`} />
                </div>
            </div>

            <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
                {bids.length === 0 ? (
                    <EmptyFilter title='No bids so far...'
                        subtitle='Feel free to make a bid!' />
                ) : (
                    <>
                        {bids.map(bid => (
                            <BidItem key={bid.id} bid={bid} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
