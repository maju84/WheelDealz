import React from 'react'
import Image from 'next/image'

type Props = {
    auction:
    {
        id: string,
        make: string,
        model: string,
        year: number,
        imageUrl: string,
    }
}

export default function AuctionCard({ auction }: Props) {
  return (
    <a href='#'>   
        <div className='w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden'>
            <div>
                <Image 
                    src={auction.imageUrl}
                    alt='image'
                    fill
                    priority
                    className='object-cover'
                    // Defines image width based on viewport width: 
                    //  100% (100vw) for <=768px, 50% (50vw) for 769px-1200px, and 25% (25vw) for >1200px
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                />
            </div>            
        </div>
        <div className='flex justify-between items-center mt-4'>
            <h3 className='text-gray-700'>{auction.make} {auction.model}</h3>
            <p className='font-semibold text-sm'>{auction.year}</p> 
        </div>
    </a>
  )
}
