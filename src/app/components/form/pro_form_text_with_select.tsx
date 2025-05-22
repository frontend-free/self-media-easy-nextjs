import * as PublishActions from '@/app/actions/publish_actions';
import { ProForm } from '@ant-design/pro-components';
import { AutoComplete } from 'antd';
import { useEffect, useState } from 'react';

interface TextWithSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

function TextWithSelect(props: TextWithSelectProps) {
  const { value, onChange } = props;

  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    PublishActions.getPublishTitles().then((titles) => {
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
    />
  );
}

function ProFormTextWithSelect(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;
  return (
    <ProForm.Item {...rest}>
      <TextWithSelect {...fieldProps} />
    </ProForm.Item>
  );
}

export { ProFormTextWithSelect };
