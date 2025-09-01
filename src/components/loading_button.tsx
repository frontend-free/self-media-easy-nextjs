'use client';

import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { useCallback, useState } from 'react';

function LoadingButton({ onClick, ...rest }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    (event) => {
      const res = onClick?.(event);

      // @ts-expect-error 先忽略
      if (res?.then) {
        setLoading(true);

        Promise.resolve(res).finally(() => {
          setLoading(false);
        });
      }
    },
    [onClick],
  );

  return <Button loading={loading} {...rest} onClick={handleClick} />;
}

export { LoadingButton };
