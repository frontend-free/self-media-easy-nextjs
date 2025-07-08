import axios from 'axios';
import md5 from 'js-md5';
import { v4 as uuidv4 } from 'uuid';
import { wrapServerAction } from './helper';

const appId = 'oANw1J9n';
const appSecret = 'mRVPOHfZTZL9J7nh';

const url = 'https://sanljt.cn/api/v1/openApi/studentRecharge';

export async function rewardsHours({ userId, second }: { userId: string; second: string }) {
  console.log('rewardsHours', userId, second);
  return wrapServerAction(async () => {
    const timestamp = new Date().valueOf() + '';

    const args = {
      appId,
      appSecret,
      nonce: uuidv4(),
      second,
      userId,
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
