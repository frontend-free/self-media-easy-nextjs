'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ServerActionResult } from '../actions/helper';

export function useGlobalSWR<T>(key: string, fetcher: () => Promise<ServerActionResult<T>>) {
  return useSWR(key, fetcher, {
    onSuccess: (data) => {
      // 直接抛出错误
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });
}

export function useGlobalSWRMutation<T, P>(
  key: string,
  fetcher: (key: string, params?: P) => Promise<ServerActionResult<T>>,
) {
  return useSWRMutation(
    key,
    (key, params) => {
      console.log('fetcher', key, params);
      return fetcher(key, params);
    },
    {
      onSuccess: (data) => {
        // 直接抛出错误
        if (!data.success) {
          throw new Error(data.message);
        }
      },
    },
  );
}
