import * as AccountActions from '@/app/actions/account_actions';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect } from '@ant-design/pro-components';
import { PlatformWithName } from '../platform';

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

        return res.data.map((item) => ({
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
            <PlatformWithName
              name={account.platformName || ''}
              value={account.platform as EnumPlatform}
            />
          );
        },
      }}
    />
  );
}

export { ProFormSelectAccounts };
