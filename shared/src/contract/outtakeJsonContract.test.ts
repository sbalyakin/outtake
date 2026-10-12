import {
  BUILDER_INJECTED_OUTPUT_FIELDS,
  RUNTIME_REQUIRED_BOOLEAN_FIELDS,
  RUNTIME_REQUIRED_STRING_FIELDS,
  validateOuttakeJsonContract,
} from './outtakeJsonContract';
import { STABLE_CONTRACT_TEST_BUILD_DATE } from './testFixtures';

const validConfig = {
  name: 'TestApp',
  targetUrl: 'https://example.com/',
  outtakeVersion: '54.0.0',
  buildDate: STABLE_CONTRACT_TEST_BUILD_DATE,
  blockExternalUrls: false,
  disableDevTools: false,
  isUpgrade: false,
  strictInternalUrls: false,
  oldBuildWarningText: '',
};

test('validateOuttakeJsonContract accepts minimal valid config', () => {
  expect(validateOuttakeJsonContract(validConfig)).toEqual([]);
});

test('validateOuttakeJsonContract rejects non-object root', () => {
  const errors = validateOuttakeJsonContract(null);
  expect(errors).toHaveLength(1);
  expect(errors[0].message).toContain('JSON object');
});

test('validateOuttakeJsonContract rejects invalid targetUrl', () => {
  const errors = validateOuttakeJsonContract({
    ...validConfig,
    targetUrl: 'not-a-url',
  });
  expect(errors.some((e) => e.field === 'targetUrl')).toBe(true);
});

test('validateOuttakeJsonContract rejects invalid tray', () => {
  const errors = validateOuttakeJsonContract({
    ...validConfig,
    tray: 'maybe',
  });
  expect(errors.some((e) => e.field === 'tray')).toBe(true);
});

test('contract constants document required and injected fields', () => {
  expect(RUNTIME_REQUIRED_STRING_FIELDS).toContain('targetUrl');
  expect(RUNTIME_REQUIRED_BOOLEAN_FIELDS).toContain('isUpgrade');
  expect(BUILDER_INJECTED_OUTPUT_FIELDS).toContain('buildDate');
});
