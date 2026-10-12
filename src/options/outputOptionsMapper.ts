import type { AppOptions, OutputOptions } from '../buildTimeContract';
import { DEFAULT_APP_NAME } from '../constants';

type OutputFieldMapping = {
  outputKey: keyof OutputOptions;
  source: 'packager' | 'outtake';
  /** AppOptions field name when it differs from the output key. */
  sourceField?: string;
};

/**
 * AppOptions → outtake.json ({@link OutputOptions}) field wiring.
 * Same-name packager/outtake fields are listed explicitly so the contract stays auditable.
 */
export const OUTPUT_FIELD_MAPPINGS: readonly OutputFieldMapping[] = [
  { outputKey: 'accessibilityPrompt', source: 'outtake' },
  { outputKey: 'alwaysOnTop', source: 'outtake' },
  { outputKey: 'appBundleId', source: 'packager' },
  { outputKey: 'appCategoryType', source: 'packager' },
  { outputKey: 'appCopyright', source: 'packager' },
  { outputKey: 'appVersion', source: 'packager' },
  { outputKey: 'arch', source: 'packager' },
  { outputKey: 'asar', source: 'packager' },
  { outputKey: 'backgroundColor', source: 'outtake' },
  { outputKey: 'basicAuthPassword', source: 'outtake' },
  { outputKey: 'basicAuthUsername', source: 'outtake' },
  { outputKey: 'blockExternalUrls', source: 'outtake' },
  { outputKey: 'bounce', source: 'outtake' },
  { outputKey: 'browserwindowOptions', source: 'outtake' },
  { outputKey: 'buildVersion', source: 'packager' },
  { outputKey: 'clearCache', source: 'outtake' },
  { outputKey: 'counter', source: 'outtake' },
  { outputKey: 'crashReporter', source: 'outtake' },
  { outputKey: 'darwinDarkModeSupport', source: 'packager' },
  { outputKey: 'derefSymlinks', source: 'packager' },
  { outputKey: 'disableContextMenu', source: 'outtake' },
  { outputKey: 'disableDevTools', source: 'outtake' },
  { outputKey: 'disableGpu', source: 'outtake' },
  { outputKey: 'disableOldBuildWarning', source: 'outtake' },
  { outputKey: 'diskCacheSize', source: 'outtake' },
  { outputKey: 'download', source: 'packager' },
  {
    outputKey: 'electronVersionUsed',
    source: 'packager',
    sourceField: 'electronVersion',
  },
  { outputKey: 'enableEs3Apis', source: 'outtake' },
  { outputKey: 'executableName', source: 'packager' },
  { outputKey: 'fastQuit', source: 'outtake' },
  { outputKey: 'fileDownloadOptions', source: 'outtake' },
  { outputKey: 'flashPluginDir', source: 'outtake' },
  { outputKey: 'fullScreen', source: 'outtake' },
  { outputKey: 'globalShortcuts', source: 'outtake' },
  { outputKey: 'height', source: 'outtake' },
  { outputKey: 'helperBundleId', source: 'packager' },
  { outputKey: 'hideWindowFrame', source: 'outtake' },
  { outputKey: 'ignoreCertificate', source: 'outtake' },
  { outputKey: 'ignoreGpuBlacklist', source: 'outtake' },
  { outputKey: 'insecure', source: 'outtake' },
  { outputKey: 'internalUrls', source: 'outtake' },
  { outputKey: 'isUpgrade', source: 'packager', sourceField: 'upgrade' },
  { outputKey: 'junk', source: 'packager' },
  { outputKey: 'lang', source: 'outtake' },
  { outputKey: 'maximize', source: 'outtake' },
  { outputKey: 'maxHeight', source: 'outtake' },
  { outputKey: 'maxWidth', source: 'outtake' },
  { outputKey: 'minHeight', source: 'outtake' },
  { outputKey: 'minWidth', source: 'outtake' },
  { outputKey: 'outtakeVersion', source: 'outtake' },
  { outputKey: 'osxNotarize', source: 'packager' },
  { outputKey: 'osxSign', source: 'packager' },
  { outputKey: 'portable', source: 'packager' },
  { outputKey: 'persistSessionCookies', source: 'outtake' },
  { outputKey: 'processEnvs', source: 'outtake' },
  { outputKey: 'protocols', source: 'packager' },
  { outputKey: 'proxyRules', source: 'outtake' },
  { outputKey: 'prune', source: 'packager' },
  { outputKey: 'quiet', source: 'packager' },
  { outputKey: 'showMenuBar', source: 'outtake' },
  { outputKey: 'singleInstance', source: 'outtake' },
  { outputKey: 'strictInternalUrls', source: 'outtake' },
  { outputKey: 'targetUrl', source: 'packager' },
  { outputKey: 'titleBarStyle', source: 'outtake' },
  { outputKey: 'tray', source: 'outtake' },
  { outputKey: 'usageDescription', source: 'packager' },
  { outputKey: 'userAgent', source: 'outtake' },
  { outputKey: 'userAgentHonest', source: 'outtake' },
  { outputKey: 'versionString', source: 'outtake' },
  { outputKey: 'width', source: 'outtake' },
  { outputKey: 'widevine', source: 'outtake' },
  { outputKey: 'win32metadata', source: 'packager' },
  { outputKey: 'x', source: 'outtake' },
  { outputKey: 'y', source: 'outtake' },
  { outputKey: 'zoom', source: 'outtake' },
];

function readAppOptionsField(
  options: AppOptions,
  source: 'packager' | 'outtake',
  field: string,
): unknown {
  const bucket = options[source] as Record<string, unknown>;
  return bucket[field];
}

/**
 * Maps normalized {@link AppOptions} into the JSON written as outtake.json.
 */
export function mapAppOptionsToOutputOptions(
  options: AppOptions,
): OutputOptions {
  const output = {} as OutputOptions;

  for (const { outputKey, source, sourceField } of OUTPUT_FIELD_MAPPINGS) {
    const field = sourceField ?? (outputKey as string);
    const value = readAppOptionsField(options, source, field);
    if (value !== undefined) {
      (output as Record<string, unknown>)[outputKey as string] = value;
    }
  }

  output.buildDate = new Date().getTime();
  output.name = options.packager.name || DEFAULT_APP_NAME;
  output.oldBuildWarningText = process.env.OLD_BUILD_WARNING_TEXT || '';

  return output;
}
