'use client';

import React, { ReactNode, useEffect, useState } from 'react';
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


const NOTIFICATIONS_URL = 'http://localhost:6001/notifications'; // process.env.NEXT_PUBLIC__NOTIFICATIONS_URL!; // ! Ensure this is correct !

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

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(NOTIFICATIONS_URL)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (!connection) return;

        const startConnection = async () => {
            try {
                await connection.start();

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
                            success: auction => <AuctionFinishedToast auction={auction} finishedAuction={finishedAuction} />,
                            error: 'Auction finished!',
                        },
                        { success: { duration: 10_000, icon: null } }
                    );
                });
            } catch (err) {
                console.error('Connection error:', err);
            }
        };

        startConnection();

        // Cleanup event listeners on component unmount or connection change
        return () => {
            connection?.stop();
            // try and error to figure out whats the problem with error log message:
            // "Error: Cannot start a HubConnection that is not in the 'Disconnected' state."
            
            // connection.off(EVENT_NAMES.BID_PLACED);
            // connection.off(EVENT_NAMES.AUCTION_CREATED);
            // connection.off(EVENT_NAMES.AUCTION_FINISHED);
        };
    }, [connection, pathname, addBid, setCurrentPrice, setIsOpen, user]);

    return children;
}
