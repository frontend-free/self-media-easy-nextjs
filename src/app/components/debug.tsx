'use client';

import localforage from 'localforage';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function useIsDebug() {
  const [isDebug, setIsDebug] = useState<boolean>(false);

  useEffect(() => {
    localforage.getItem('isDebug').then((v) => {
      setIsDebug(!!v);
    });
  }, []);

  const handleSetIsDebug = (value: boolean) => {
    setIsDebug(value);
    localforage.setItem('isDebug', value);
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
      {isDebug && <div className="text-red-500">isDebug</div>}
      {children}
    </div>
  );
}
export { DebugWrapVersion, useIsDebug };
