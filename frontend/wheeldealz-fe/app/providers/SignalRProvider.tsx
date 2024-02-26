'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuctionsStore } from '../hooks/useAuctionsStore';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Bid } from '@/types';

type Props = {
    children: ReactNode
}

export default function SignalRProvider({ children }: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { setCurrentPrice } = useAuctionsStore();
    // const { addBid } = useBidsStore();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:6001/notifications')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []); // called only once

    useEffect(() => {
        if (connection) {
            connection.start()
                .then( () => { 
                    console.log('Connected to notifications hub.');
                    connection.on('BidPlaced',  // ! must match exactly sender's magic string !
                        (bid: Bid) => {
                            console.log('Received BidPlaced!');
                            if (bid.bidStatus.includes('Accepted')) {
                                setCurrentPrice(bid.auctionId, bid.amount);
                            }
                    });
                }).catch(err => console.log(err));
        }

        return () => {
            connection?.stop().then(() => console.log('Disconnected from notifications hub.'));
        };

    }, [connection, setCurrentPrice]);

  return (
    children
  );
}
