import { Account } from '@/generated/prisma';
import { ProFormText } from '@ant-design/pro-components';
import { CRUD } from '../components/crud';

function Page() {
  return (
    <CRUD<Account, Partial<Pick<Account, 'name'>>>
      title="账号"
      columns={[
        {
          title: '账号',
          dataIndex: 'name',
        },
        {
          title: '类型',
          dataIndex: 'type',
        },
        {
          title: '教练',
          dataIndex: 'tagCoach',
        },
      ]}
      detailForm={
        <div>
          <ProFormText name="name" label="用户名" />
        </div>
      }
      request={() =>
        Promise.resolve({
          data: [],
          total: 0,
          success: true,
        })
      }
      requestAdd={() => Promise.resolve()}
      requestDelete={() => Promise.resolve()}
    />
  );
}

export default Page;
