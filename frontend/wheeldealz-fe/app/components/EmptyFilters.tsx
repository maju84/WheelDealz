import React from 'react';
import Heading from './Heading';
import { Button } from 'flowbite-react';
import { useParamsStore } from '../hooks/useParamsStore';

type Props = {
    title?: string;
    subtile?: string;
    showReset?: boolean;
}

export default function EmptyFilters({
    title = 'No results found.',
    subtile = 'Try changing the filters or reset them.',
    showReset
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
        </div>
    </div>
  );
}
