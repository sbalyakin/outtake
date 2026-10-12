import { validateOuttakeJsonContract } from '../../../shared/lib/src/contract/outtakeJsonContract';
import { STABLE_CONTRACT_TEST_BUILD_DATE } from '../../../shared/lib/src/contract/testFixtures';
import { parseRuntimeConfigJson } from './loadRuntimeConfig';

const minimalValidJson = JSON.stringify({
  name: 'APP',
  targetUrl: 'https://example.com/',
  outtakeVersion: '54.0.0',
  buildDate: STABLE_CONTRACT_TEST_BUILD_DATE,
  blockExternalUrls: false,
  disableDevTools: false,
  isUpgrade: false,
  strictInternalUrls: false,
  oldBuildWarningText: '',
});

test('runtime parser accepts JSON that passes shared contract', () => {
  const config = parseRuntimeConfigJson(minimalValidJson);
  expect(config.targetUrl).toBe('https://example.com/');
  expect(validateOuttakeJsonContract(config)).toEqual([]);
});
