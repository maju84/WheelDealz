'use client';

import React, { useState } from 'react';
import { updateAuctionTest } from '../actions/GetAuctionsAction';
import { Button } from 'flowbite-react';

export default function AuthTest() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<unknown>();

    const doUpdate = () => {
        setResult(undefined);
        setLoading(true);
        updateAuctionTest()
        .then((response) => {
            setResult(response);
        })
        .catch((error) => {
            setResult(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

  return (
    <div className='flex items-center gap-4'>
        <Button outline isProcessing={loading} onClick={doUpdate}>
            Test Auth
        </Button>
        <div>
            {JSON.stringify(result, null, 2)}
        </div>
    </div>
  );
}
