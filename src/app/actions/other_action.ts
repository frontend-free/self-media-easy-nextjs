import { latestAppVersion } from '../../../package.json';

async function getLatestAppVersion() {
  return latestAppVersion;
}

export { getLatestAppVersion };
