import { useEffect, useState } from 'react';

/** Live countdown to a target date: { days, hours, minutes, seconds, done }. */
export function useCountdown(target) {
  const end = target ? new Date(target).getTime() : 0;
  const calc = () => Math.max(0, end - Date.now());
  const [left, setLeft] = useState(calc);

  useEffect(() => {
    if (!end) return undefined;
    setLeft(calc());
    const t = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end]);

  return {
    days: Math.floor(left / 864e5),
    hours: Math.floor((left / 36e5) % 24),
    minutes: Math.floor((left / 6e4) % 60),
    seconds: Math.floor((left / 1e3) % 60),
    done: left === 0,
  };
}
