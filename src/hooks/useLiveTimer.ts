import { useState, useEffect } from "react";

/**
 * useLiveTimer hook solves the stale closure challenge by providing a 
 * synchronized "now" timestamp that updates every 10 seconds.
 * 
 * Components using this will re-render on the interval, ensuring 
 * "X seconds ago" labels are always accurate without needing to 
 * reach into a stale state.
 */
export const useLiveTimer = (intervalMs: number = 10000) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
};

export const formatTimeAgo = (timestamp: number, now: number) => {
  const seconds = Math.floor((now - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};
