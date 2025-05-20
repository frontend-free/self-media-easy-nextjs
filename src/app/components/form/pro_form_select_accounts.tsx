import * as AccountActions from '@/app/actions/account_actions';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { Account, AccountStatus } from '@/generated/prisma';
import { ProFormSelect } from '@ant-design/pro-components';
import { PlatformWithName } from '../platform';

function ProFormSelectAccounts(props) {
  return (
    <ProFormSelect
      mode="multiple"
      request={async () => {
        const res = await AccountActions.pageAccounts({
          pageSize: 100,
          current: 1,
          status: EnumAccountStatus.AUTHED,
        });
        return res.data.map((item) => ({
          label: item.platformName,
          value: item.id,
          originData: item,
        }));
      }}
      fieldProps={{
        optionRender: (option) => {
          const account = option.data.originData as Account;
          return (
            <PlatformWithName
              name={account.platformName || ''}
              value={account.platform as EnumPlatform}
              status={account.status as AccountStatus}
            />
          );
        },
      }}
      {...props}
    />
  );
}

export { ProFormSelectAccounts };
