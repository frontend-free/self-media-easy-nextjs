'use client';

import { App } from 'antd';
import { useEffect } from 'react';

function ErrorComponent() {
  const { message } = App.useApp();

  useEffect(() => {
    function handleError(event) {
      console.log('handleError', event);

      if (event.reason) {
        if (event.reason.message || event.reason.reason) {
          message.error(event.reason.message || event.reason.reason);
          return;
        }
      }

      if (event.error) {
        if (event.error.message || event.error.reason) {
          message.error(event.error.message || event.error.reason);
          return;
        }
      }

      // unknown error
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return null;
}

export { ErrorComponent };
