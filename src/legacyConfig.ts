/**
 * Legacy config normalization for the published CLI (`lib/` only at runtime).
 * Keep in sync with `shared/src/contract/outtakeJsonContract.ts`.
 */
export function normalizeLegacyOutputConfig(
  value: unknown,
): Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return {};
  }
  const record = { ...(value as Record<string, unknown>) };
  if (
    (record.outtakeVersion === undefined ||
      (typeof record.outtakeVersion === 'string' &&
        record.outtakeVersion.length === 0)) &&
    typeof record.nativefierVersion === 'string' &&
    record.nativefierVersion.length > 0
  ) {
    record.outtakeVersion = record.nativefierVersion;
  }
  return record;
}
