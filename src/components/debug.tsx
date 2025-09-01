'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function useIsDebug() {
  const [isDebug, setIsDebug] = useState<boolean>(false);

  useEffect(() => {
    const v = localStorage.getItem('isDebug');
    setIsDebug(v === 'true');
  }, []);

  const handleSetIsDebug = (value: boolean) => {
    setIsDebug(value);
    localStorage.setItem('isDebug', value ? 'true' : 'false');
  };

  return {
    isDebug,
    setIsDebug: handleSetIsDebug,
  };
}

function DebugWrapVersion({ children }: { children: React.ReactNode }) {
  const ref = useRef<number>(0);
  const refTimer = useRef<any>(null);
  const router = useRouter();

  const { isDebug } = useIsDebug();

  return (
    <div
      className="flex gap-1"
      onClick={() => {
        clearTimeout(refTimer.current);

        ref.current += 1;

        if (ref.current >= 5) {
          router.push('/debug');
        }

        refTimer.current = setTimeout(() => {
          ref.current = 0;
        }, 1000);
      }}
    >
      {children}
      {isDebug && <div className="text-red-500">isDebug</div>}
    </div>
  );
}

export { DebugWrapVersion, useIsDebug };
