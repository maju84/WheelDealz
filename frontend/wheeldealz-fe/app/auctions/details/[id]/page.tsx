import { getAuctionDetails } from '@/app/actions/GetAuctionsAction';
import Heading from '@/app/components/Heading';
import React from 'react';
import CountdownTimer from '../../CountdownTimer';
import CarImage from '../../CarImage';
import DetailedSpecs from '../DetailedSpecs';
import EditButton from './EditButton';
import { getCurrentUser } from '@/app/actions/AuthActions';
import DeleteButton from './DeleteButton';
import BidList from './BidList';

export default async function Details({ params }: { params: { id: string } }) {
  const auction = await getAuctionDetails(params.id);
  const user = await getCurrentUser();

  return ( 
    <div>
      <div className='flex justify-between'>
      <div className='flex items-center gap-3'>
          <Heading title={`${auction.make} ${auction.model}`} subtitle={''} />
          {user?.username === auction.seller && (
            <>
              <EditButton id={auction.id} />
              <DeleteButton id={auction.id} />
            </>

          )}
        </div>

        <div className='flex gap-3'>
          <h3 className='text-2xl font-semibold'>Time remaining:</h3>
          <CountdownTimer auctionEnd={auction.endsAt} />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6 mt-3'>
        <div className='w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden'>
          <CarImage imageUrl={auction.imageUrl} />
        </div>

        <BidList user={ user } auction={ auction } />
      </div>

      <div className='mt-3 grid grid-cols-1 rounded-lg'>
        <DetailedSpecs auction={auction} />
      </div>

    </div>
  );
}
