'use client';

import React from 'react';
import Heading from './Heading';
import { Button } from 'flowbite-react';
import { useParamsStore } from '../hooks/useParamsStore';
import { signIn } from 'next-auth/react';

type Props = {
    title?: string;
    subtitle?: string;
    showReset?: boolean;

    showLogin?: boolean;    // todo - not really the best place for this
    callbackUrl?: string;
}

export default function EmptyFilter({
    title = 'No results found.',
    subtitle: subtile = 'Try changing the filters or reset them.',
    showReset,
    showLogin,
    callbackUrl
} : Props) {
    // todo resetting everything is a bit too much actually
    const reset = useParamsStore(state => state.reset); 
  return (
    <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
        <Heading title={title} subtitle={subtile} center/>
        <div className='mt-4'>
            {showReset && (
                <Button outline onClick={reset}>Reset filters</Button>
            )}
            {showLogin && (
                <Button outline onClick={ () => signIn('id-server', { callbackUrl }) }>Login</Button>
            )}
        </div>
    </div>
  );
}
