'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Auction, AuctionFinished, Bid } from '@/types';
import toast from 'react-hot-toast';
import { useAuctionsStore } from '../hooks/useAuctionsStore';
import { useBidsStore } from '../hooks/useBidsStore';
import { usePathname } from 'next/navigation';
import AuctionCreatedToast from '../components/toasts/AuctionCreatedToast';
import AuctionFinishedToast from '../components/toasts/AuctionFinishedToast';
import { getAuctionDetails } from '../actions/GetAuctionsAction';
import { Session } from 'next-auth';

type Props = {
    children: ReactNode;
    user: Session['user'] | null;
};

const NOTIFICATIONS_URL = process.env.NEXT_PUBLIC__NOTIFICATIONS_URL!; // ! Ensure this is correct !

const EVENT_NAMES = {
    BID_PLACED: 'BidPlaced',
    AUCTION_CREATED: 'AuctionCreated',
    AUCTION_FINISHED: 'AuctionFinished',
};

export default function SignalRProvider({ children, user }: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const pathname = usePathname();
    const { setCurrentPrice } = useAuctionsStore();
    const { addBid, setIsOpen } = useBidsStore();

    // Use a ref to track whether the event listeners have been set up
    const listenersSetUp = useRef(false);

    useEffect(() => {
        // Initialize connection only once
        if (!connection) {
            const newConnection = new HubConnectionBuilder()
                .withUrl(NOTIFICATIONS_URL)
                .withAutomaticReconnect()
                .build();

            newConnection.start()
                .then(() => setConnection(newConnection))
                .catch(err => console.error('SignalR Connection Error:', err));
        }

        // Cleanup on unmount
        return () => {
            connection?.stop();
        };
        // need to include conncection here to get rid of a warning in 'npm run build'
        // but with the useRef flag it works fine anyway
    }, [connection]); 

    useEffect(() => {
        // Setup event listeners only once after the connection is established
        if (connection && !listenersSetUp.current) {
            listenersSetUp.current = true; // Mark that listeners are set up


                connection.on(EVENT_NAMES.BID_PLACED, (bid: Bid) => {
                    if (bid.bidStatus.includes('Accepted')) {
                        setCurrentPrice(bid.auctionId, bid.amount);
                    }
                    if (pathname.includes(bid.auctionId)) {
                        addBid(bid);
                    }
                });
    

                connection.on(EVENT_NAMES.AUCTION_CREATED, (auction: Auction) => {
                    if (user?.username !== auction.seller) {
                        toast(<AuctionCreatedToast auction={auction} />, { duration: 10_000 });
                    }
                });
    

                connection.on(EVENT_NAMES.AUCTION_FINISHED, async (finishedAuction: AuctionFinished) => {
                    const auctionDetails = await getAuctionDetails(finishedAuction.auctionId);
                    if (pathname.includes(finishedAuction.auctionId)) {
                        setIsOpen(false);
                    }
                    toast.promise(
                        Promise.resolve(auctionDetails),
                        {
                            loading: 'Loading...',
                            success: auction => {
                                return <AuctionFinishedToast auction={auction} finishedAuction={finishedAuction} />;
                            },
                            error: 'Auction finished!',
                        },
                        { success: { duration: 10_000, icon: null } }
                    );
                });
        }

        // Cleanup function to remove event listeners
        return () => {
            connection?.off(EVENT_NAMES.BID_PLACED);
            connection?.off(EVENT_NAMES.AUCTION_CREATED);
            connection?.off(EVENT_NAMES.AUCTION_FINISHED);
            listenersSetUp.current = false; // Reset the flag
        };
    }, [addBid, connection, pathname, setCurrentPrice, setIsOpen, user?.username]);

    return children;
}
