import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';

type Props = {
    auctionEnd: string
};

const VERY_FEW_HOURS = 4;
const FEW_HOURS = 12;

// Renderer callback with condition
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  let backgroundColorClass = 'bg-green-600';
  if (completed) {
    backgroundColorClass = 'bg-gray-600';
  } else if (days === 0 && hours < VERY_FEW_HOURS) {
    backgroundColorClass = 'bg-red-600';
  } else if (days === 0 && hours < FEW_HOURS) {
    backgroundColorClass = 'bg-amber-600';
  }

  return (
    <div className={`
        countdown-timer ${backgroundColorClass} 
        border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center items-center
    `}>
      {completed ? (
        <span className="completed">Finished</span>
      ) : (
        <span suppressHydrationWarning={true}>
          {zeroPad(days)}d - {zeroPad(hours)}h : {zeroPad(minutes)}m : {zeroPad(seconds)}s
        </span>
      )}
    </div>
  );
};

export default function CountdownTimer({ auctionEnd }: Props) {
  return (
    <div>
        <Countdown date={auctionEnd} renderer={renderer} />
    </div>
  );
}
