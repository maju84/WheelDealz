'use client';

import React from 'react';
import Image from 'next/image';

export default function CarImage({imageUrl} : {imageUrl: string}) {
    const [isLoading, setLoading] = React.useState(true);
  return (
    <Image 
        src={imageUrl}
        alt='image'
        fill
        priority
        className={`
            object-cover group-hover:opacity-80 duration-700 ease-in-out
            ${isLoading 
                ? 'grayscale blur-2xl scale-110' 
                : 'grayscale-none blur-none scale-100'}
            `}
        // Defines image width based on viewport width: 
        //  100% (100vw) for <=768px, 50% (50vw) for 769px-1200px, and 25% (25vw) for >1200px
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
        onLoad={() => setLoading(false)}
    />
    );
}
