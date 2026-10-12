import 'source-map-support/register';

import { buildOuttakeApp } from './build/buildOuttakeApp';
import { RawOptions } from './buildTimeContract';

export { buildOuttakeApp };

/** @deprecated Use {@link buildOuttakeApp}. */
export { buildNativefierApp } from './build/buildOuttakeApp';

/**
 * Only for compatibility with Nativefier <= 7.7.1 !
 * Use the better, modern async `buildOuttakeApp` instead if you can!
 */
function buildOuttakeAppOldCallbackStyle(
  options: RawOptions,
  callback: (err?: Error, result?: string) => void,
): void {
  buildOuttakeApp(options)
    .then((result) => callback(undefined, result))
    .catch((err: Error) => callback(err));
}

/** @deprecated Use {@link buildOuttakeApp}. */
export default buildOuttakeAppOldCallbackStyle;
