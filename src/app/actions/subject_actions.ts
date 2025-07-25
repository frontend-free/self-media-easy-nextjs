import axios from 'axios';
import md5 from 'js-md5';
import { v4 as uuidv4 } from 'uuid';
import { getAccountById } from './account_actions';
import { wrapServerAction } from './helper';
import { getSchoolById } from './school_actions';

const appId = 'oANw1J9n';
const appSecret = 'mRVPOHfZTZL9J7nh';

const url = 'https://sanljt.cn/api/v1/openApi/studentRecharge';

export async function rewardsHours({
  accountId,
  studentId,
  type,
}: {
  accountId: string;
  studentId: string;
  type: 'auth' | 'video';
}) {
  let second: number | undefined = undefined;

  console.log('rewardsHours', accountId, studentId, type);

  // 找到账号
  const account = await getAccountById(accountId);
  if (!account.schoolId) {
    console.log('rewardsHours', '没有 schoolId');
    return;
  }

  // 找到驾校
  const school = await getSchoolById(account.schoolId);
  if (school) {
    if (type === 'auth') {
      second = school.authRewardHours || 840;
    } else if (type === 'video') {
      second = school.videoRewardHours || 600;
    }
  }

  console.log('rewardsHours second', second);
  if (!second) {
    console.log('rewardsHours', '没有 second');
    return;
  }

  return wrapServerAction(async () => {
    const timestamp = new Date().valueOf() + '';

    const args = {
      appId,
      appSecret,
      nonce: uuidv4(),
      second: second + '',
      userId: studentId,
      timestamp,
    };

    const keys = Object.keys(args).sort();
    const kvString = keys.map((key) => `${key}${args[key]}`).join('');

    const data: any = {
      ...args,
      // @ts-expect-error js-md5 类型错误
      sign: md5(kvString).toUpperCase(),
    };

    delete data.appSecret;

    const res = await axios.post(url, data);

    console.log('rewardsHours ref', res.data);
  });
}
