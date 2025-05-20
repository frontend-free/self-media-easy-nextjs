'use server';

import packageJSON from '../../../package.json';
import { ServerActionResult } from './helper';

async function getLatestAppVersion(): Promise<ServerActionResult<string>> {
  return {
    success: true,
    data: packageJSON.latestAppVersion,
  };
}

export { getLatestAppVersion };
