import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 2000, start = true, resetKey?: unknown): number {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const lastResetKey = useRef<unknown>(resetKey);

  useEffect(() => {
    if (resetKey !== undefined && resetKey !== lastResetKey.current) {
      lastResetKey.current = resetKey;
      startedRef.current = false;
      setCount(0);
    }
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, resetKey]);

  return count;
}
