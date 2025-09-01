import * as AccountActions from '@/app/actions/account_actions';
import { handleRequestRes } from '@/app/lib/request';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect } from '@ant-design/pro-components';
import { Platform } from '../platform';

function ProFormSelectAccounts(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;

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

        return res.data?.data.map((item) => ({
          label: item.platformName,
          value: item.id,
          originData: item,
        }));
      }}
      fieldProps={{
        mode: 'multiple',
        optionRender: (option) => {
          const account = option.data.originData as Account;
          return (
            <Platform name={account.platformName || ''} value={account.platform as EnumPlatform} />
          );
        },
      }}
    />
  );
}

export { ProFormSelectAccounts };
