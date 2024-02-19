import EmptyFilters from '@/app/components/EmptyFilters';
import React from 'react';

export default function page({ searchParams }: 
    { searchParams: { callbackUrl: string;}}) {
  return (
    <EmptyFilters
        title='You need to be logged in to see this page.'
        subtile='Please click below to login.'
        showLogin
        callbackUrl={ searchParams.callbackUrl }
    />
  );
}
