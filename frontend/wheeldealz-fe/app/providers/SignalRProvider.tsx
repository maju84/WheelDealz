'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuctionsStore } from '../hooks/useAuctionsStore';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Auction, AuctionFinished, Bid } from '@/types';
import { useBidsStore } from '../hooks/useBidsStore';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import AuctionCreatedToast from '../components/toasts/AuctionCreatedToast';
import toast from 'react-hot-toast';
import { getAuctionDetails } from '../actions/GetAuctionsAction';
import AuctionFinishedToast from '../components/toasts/AuctionFinishedToast';

// Centralized event names (consider moving these to a config file)
const BID_PLACED_EVENT_NAME = 'BidPlaced';
const AUCTION_CREATED_EVENT_NAME = 'AuctionCreated';
const AUCTION_FINISHED_EVENT_NAME = 'AuctionFinished';

const NOTIFICATIONS_URL = 'http://localhost:6001/notifications';

type Props = {
    children: ReactNode;
    user: Session['user'] | null;
};

export default function SignalRProvider({ children, user }: Props) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { setCurrentPrice } = useAuctionsStore();
    const { addBid, setIsOpen } = useBidsStore();
    const pathname = usePathname();

    const showAuctionCreatedToast = (auction: Auction) => {
        toast(<AuctionCreatedToast auction={auction} />, { duration: 10_000 });
    };

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
                connection.on(BID_PLACED_EVENT_NAME, (bid: Bid) => {
                    if (bid.bidStatus.includes('Accepted')) {
                        setCurrentPrice(bid.auctionId, bid.amount);
                    }
                    if (pathname.includes(bid.auctionId)) {
                        addBid(bid);
                    }
                });

                connection.on(AUCTION_CREATED_EVENT_NAME, (auction: Auction) => {
                    if (user?.username !== auction.seller) {
                        showAuctionCreatedToast(auction);
                    }
                });

                connection.on(AUCTION_FINISHED_EVENT_NAME, async (finishedAuction: AuctionFinished) => {
                    const auctionDetails = await getAuctionDetails(finishedAuction.auctionId);
                    toast.promise(
                        Promise.resolve(auctionDetails), {
                            loading: 'Loading...',
                            success: auction => {
                                // if the user is on this finished auction's details page
                                if (pathname.includes(finishedAuction.auctionId)) {
                                    setIsOpen(false); // set global flag (to close the bid form)
                                }
                                return <AuctionFinishedToast auction={auction} finishedAuction={finishedAuction} />;
                            },
                            error: 'Auction finished!'
                        }, { success: { duration: 10_000, icon: null },
                        }
                    );
                });
            } catch (err) {
                console.error('Connection error:', err);
            }
        };

        startConnection();

        return () => {
            if (connection) {
                connection.stop();
                connection.off(BID_PLACED_EVENT_NAME);
                connection.off(AUCTION_CREATED_EVENT_NAME);
                connection.off(AUCTION_FINISHED_EVENT_NAME);
            }
        };
    }, [addBid, connection, pathname, setCurrentPrice, setIsOpen, user]);

    return children;
}
