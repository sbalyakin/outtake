import * as fs from 'fs';
import * as path from 'path';

/** Keep in sync with `shared/src/contract.ts`. */
export const OUTTAKE_JSON_FILENAME = 'outtake.json';

/** Legacy config filename from upstream Nativefier; read-only fallback for upgrade. */
export const LEGACY_NATIVEFIER_JSON_FILENAME = 'nativefier.json';

/** @deprecated Use {@link LEGACY_NATIVEFIER_JSON_FILENAME}. */
export const NATIVEFIER_JSON_FILENAME = LEGACY_NATIVEFIER_JSON_FILENAME;

export function getRuntimeConfigPath(): string {
  const appDir = path.join(__dirname, '..');
  const outtakePath = path.join(appDir, OUTTAKE_JSON_FILENAME);
  if (fs.existsSync(outtakePath)) {
    return outtakePath;
  }
  return path.join(appDir, LEGACY_NATIVEFIER_JSON_FILENAME);
}
