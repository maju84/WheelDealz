'use client';

import { placeBidForAuction } from '@/app/actions/GetAuctionsAction';
import { useBidsStore } from '@/app/hooks/useBidsStore';
import { numberWithDots } from '@/app/utils/numberWithDots';
import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
    auctionId: string;
    highBid: number;
}

export default function BidForm({ auctionId, highBid }: Props) {
    const { register, handleSubmit, reset } = useForm();
    const { addBid } = useBidsStore();

    const onSubmit = (data: FieldValues) => {
        if (data.amount <= highBid) {
            reset();
            return toast.error('Your bid must be higher than the current bid');
        }

        placeBidForAuction(auctionId, +data.amount) // Convert amount string to number
            .then((bid) => {
                if (bid.error) {
                    throw bid.error;
                }

                // no since we add received bids from SignalR to bids store (see SignalProvider.tsx) 
                // this is kind of redundant but not wrong. addBid checks for duplicates
                addBid(bid);    
                
                reset();
            })
            .catch(err => {
                toast.error(err.message);
            });
        };

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className='flex items-center border-2 rounded-lg py-2'>
        <input 
            type='number' 
            { ...register('amount') } 
            className='input-custom text-sm text-gray-600'
            placeholder={`Place a bid higher than $${numberWithDots(highBid)}`}
        />
    </form>
  );
}
