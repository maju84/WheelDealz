'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuctionsStore } from '../hooks/useAuctionsStore';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Bid } from '@/types';
import { useBidsStore } from '../hooks/useBidsStore';
import { usePathname } from 'next/navigation';

const BID_PLACED_EVENT_NAME = 'BidPlaced';  // ! must match exactly sender's magic string !
const NOTIFICATIONS_URL = 'http://localhost:6001/notifications';


type Props = {
    children: ReactNode
}
export default function SignalRProvider({ children }: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { setCurrentPrice } = useAuctionsStore();
    const { addBid } = useBidsStore();
    const pathname = usePathname();

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(NOTIFICATIONS_URL)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []); // called only once

    useEffect(() => {
        if (connection) {
            connection.start()
                .then( () => {
                    connection.on(BID_PLACED_EVENT_NAME,  
                        (bid: Bid) => {
                            if (bid.bidStatus.includes('Accepted')) {
                                setCurrentPrice(bid.auctionId, bid.amount);
                            }
                            // only add bids if we are on this auction's details page
                            if(pathname.includes(bid.auctionId)) {
                                addBid(bid);
                              }
                    });
                }).catch(err => console.log(err));
        }

        return () => {
            connection?.stop();
            connection?.off(BID_PLACED_EVENT_NAME);

        };

    }, [addBid, pathname, connection, setCurrentPrice]);

  return (
    children
  );
}
