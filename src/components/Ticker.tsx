import React, { useState, useEffect } from "react";
import { formatDistance, formatDistanceStrict, fromUnixTime } from "date-fns";

export interface ITickerProps {
  time: number;
}
export const Ticker = ({ time }: ITickerProps) => {
  const [display, setDisplay] = useState(formatDistance(new Date(), time));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(
        formatDistance(time, new Date())
      );
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (<>{display}</>);
};

export default Ticker;
