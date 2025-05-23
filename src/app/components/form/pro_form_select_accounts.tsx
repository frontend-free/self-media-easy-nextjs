import * as AccountActions from '@/app/actions/account_actions';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { Account, AccountStatus } from '@/generated/prisma';
import { ProForm } from '@ant-design/pro-components';
import { Alert, Transfer } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PlatformWithName } from '../platform';

interface DataItem {
  title: string;
  key: string;
  originData?: Account;
  disabled?: boolean;
}

function SelectAccounts({ value, onChange }) {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    AccountActions.pageAccounts({
      pageSize: 1000,
      current: 1,
      status: EnumAccountStatus.AUTHED,
    }).then((res) => {
      const d = res.data.map((item) => ({
        title: item.platformName,
        key: item.id,
        originData: item,
      })) as DataItem[];

      setData(d);
    });
  }, []);

  const handleChange = useCallback(
    (nextTargetKeys) => {
      onChange(nextTargetKeys);
    },
    [onChange],
  );

  const invalidValue = useMemo(() => {
    const keyMap = {};
    data.forEach((item) => {
      keyMap[item.key] = true;
    });

    return value?.filter((v) => !keyMap[v]) || [];
  }, [data, value]);

  const dataSource = useMemo(() => {
    const invalidData = invalidValue.map((v) => ({
      title: '账号已删除',
      key: v,
      disabled: true,
    }));

    return [...data, ...invalidData];
  }, [data, invalidValue]);

  return (
    <div>
      {invalidValue.length > 0 && (
        <div className="mb-2">
          <Alert type="warning" message="存在已删除账号，重新提交会自动移除已删除账号" />
        </div>
      )}

      <Transfer
        dataSource={dataSource}
        titles={['待选择', '已选']}
        targetKeys={value}
        onChange={handleChange}
        render={(item) => {
          if (item.disabled) {
            return <div>账号已删除</div>;
          }
          return (
            <PlatformWithName
              name={item.originData.platformName || ''}
              value={item.originData.platform as EnumPlatform}
              status={item.originData.status as AccountStatus}
            />
          );
        }}
        listStyle={() => ({
          width: '300px',
          height: '300px',
        })}
      />
    </div>
  );
}

function ProFormSelectAccounts(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;
  return (
    <ProForm.Item {...rest}>
      <SelectAccounts {...fieldProps} />
    </ProForm.Item>
  );
}

export { ProFormSelectAccounts };
