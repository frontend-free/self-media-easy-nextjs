'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>全局错误</h2>
        <div>{error.message}</div>
        <button onClick={reset}>重试</button>
      </body>
    </html>
  );
}
