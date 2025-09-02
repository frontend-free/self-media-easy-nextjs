import { electronApi } from '@/electron';
import { DeleteOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-components';
import { Alert, Button } from 'antd';
import { getFileNameWithExtension } from '../resource';

interface FilesProps {
  value?: string;
  onChange: (value?: string) => void;
}

function Files(props: FilesProps) {
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={async () => {
            const res = await electronApi.showOpenDialogOfOpenFile();
            if (res.success) {
              props.onChange(res.data?.filePaths[0] || undefined);
            }
          }}
        >
          选择视频
        </Button>

        {props.value && (
          <div className="flex flex-row items-center gap-2">
            <div className="">{getFileNameWithExtension(props.value)}</div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => props.onChange(undefined)}
            />
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Alert
          message={
            <div>
              {/* 抖音 16G 1h; 视频号 4G 2h; */}
              <div>视频文件大小不超过4G，时长在60分钟以内。否则可能影响发布。</div>
            </div>
          }
          type="info"
        />
      </div>
    </div>
  );
}

function ProFormFiles(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;
  return (
    <ProForm.Item {...rest}>
      <Files {...fieldProps} />
    </ProForm.Item>
  );
}

export { ProFormFiles };
