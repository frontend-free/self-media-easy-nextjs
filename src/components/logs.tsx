'use client';

import { App, Button } from 'antd';

function CheckLogs({ value }: { value?: string | null }) {
  const { modal } = App.useApp();

  return (
    <Button
      type="link"
      className="!px-0"
      onClick={() => {
        modal.info({
          title: '日志',
          width: 800,
          content: (
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: 'calc(100vh - 300px)',
              }}
            >
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(JSON.parse(value || '{}'), null, 2).replace(/\\n/g, '\n')}
              </pre>
            </div>
          ),
        });
      }}
    >
      查看日志
    </Button>
  );
}

export { CheckLogs };
