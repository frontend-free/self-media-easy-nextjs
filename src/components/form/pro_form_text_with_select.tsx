import * as PublishActions from '@/app/actions/publish_actions';
import { handleRequestRes } from '@/lib/request';
import { ProForm } from '@ant-design/pro-components';
import { Alert, AutoComplete } from 'antd';
import { useEffect, useState } from 'react';

interface TextWithSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

function TextWithSelect(props: TextWithSelectProps) {
  const { value, onChange } = props;

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    PublishActions.getPublishTitles().then(async (res) => {
      await handleRequestRes(res);

      const titles = res.data || [];
      setOptions(titles.map((title) => ({ label: title, value: title })));
    });
  }, [value]);

  return (
    <AutoComplete
      options={options}
      value={value}
      onSearch={(value) => {
        onChange(value);
      }}
      onSelect={(value) => {
        onChange(value);
      }}
      allowClear
      placeholder={'请输入标题'}
    />
  );
}

function ProFormTextWithSelect(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;
  return (
    <ProForm.Item
      {...rest}
      rules={[
        {
          min: 6,
          max: 30,
          message: '标题至少需要6个字,最多30个字',
        },
        {
          pattern: /^[\u4e00-\u9fa5a-zA-Z0-9《》""：+?%℃\s]+$/,
          message: '符号仅支持书名号、引号、冒号、加号、问号、百分号、摄氏度，逗号可用空格代替',
        },
      ]}
      extra={
        <div className="mt-2">
          <Alert
            type="info"
            message="最少6个字,最多30个字；符号仅支持书名号、引号、冒号、加号、问号、百分号、摄氏度，逗号可用空格代替"
          />
        </div>
      }
    >
      <TextWithSelect {...fieldProps} />
    </ProForm.Item>
  );
}

function isTitleValid(title) {
  let valid = true;
  const reg = /^[\u4e00-\u9fa5a-zA-Z0-9《》""：+?%℃\s]+$/;
  if (!reg.test(title)) {
    valid = false;
  }
  if (title.length < 6 || title.length > 30) {
    valid = false;
  }

  return valid;
}

export { isTitleValid, ProFormTextWithSelect };
