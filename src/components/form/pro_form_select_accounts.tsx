import * as AccountActions from '@/app/actions/account_actions';
import { EnumAccountStatus, EnumPlatform, valueEnumPlatform } from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { handleRequestRes } from '@/lib/request';
import { ProFormSelect } from '@ant-design/pro-components';
import { useMemo, useState } from 'react';
import { Platform } from '../platform';

function ProFormSelectAccounts(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;

  const [accounts, setAccounts] = useState<Account[]>([]);

  const accountsMap = useMemo(() => {
    return accounts.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [accounts]);

  return (
    <ProFormSelect
      {...rest}
      request={async () => {
        const res = await AccountActions.pageAccounts({
          pageSize: 1000,
          current: 1,
          status: EnumAccountStatus.AUTHED,
        });
        await handleRequestRes(res);

        setAccounts(res.data?.data || []);

        const group = {};

        res.data?.data.forEach((item) => {
          if (!group[item.platform!]) {
            group[item.platform!] = [];
          }

          group[item.platform!].push({
            label: item.platformName,
            value: item.id,
            originData: item,
          });
        });

        const result = Object.keys(group).map((key) => {
          return {
            label: valueEnumPlatform[key].text,
            options: group[key],
          };
        });

        console.log(result);

        return result;
      }}
      fieldProps={{
        showSearch: true,
        mode: 'multiple',
        optionRender: (option) => {
          const account = option.data.originData as Account;
          return (
            <Platform name={account.platformName || ''} value={account.platform as EnumPlatform} />
          );
        },
        labelRender: ({ value }) => {
          const account = accountsMap[value];

          return (
            <Platform name={account.platformName || ''} value={account.platform as EnumPlatform} />
          );
        },
      }}
    />
  );
}

export { ProFormSelectAccounts };
