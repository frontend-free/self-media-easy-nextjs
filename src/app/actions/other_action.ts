'use server';

import packageJSON from '../../../package.json';

async function getLatestAppVersion() {
  return packageJSON.latestAppVersion;
}

export { getLatestAppVersion };
