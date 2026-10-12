/**
 * Page main-world Notification shim (injected via webContents.executeJavaScript).
 * Must not close over module scope in {@link installNotificationShimInPage}.
 */

export const NOTIFICATION_SHIM_INSTALLED_KEY =
  '__outtakeNotificationShimInstalled';

/** Legacy upstream key; still checked for dual-read compatibility. */
export const LEGACY_NOTIFICATION_SHIM_INSTALLED_KEY =
  '__nativefierNotificationShimInstalled';

export type OuttakeNotifySend = (
  op: 'create' | 'click',
  title?: string,
  opt?: NotificationOptions,
) => void;

/** @deprecated Use {@link OuttakeNotifySend}. */
export type NativefierNotifySend = OuttakeNotifySend;

export function wrapNotificationConstructor(
  OldNotify: typeof Notification,
  sendNotify: OuttakeNotifySend,
): typeof Notification {
  const newNotify = function (
    title: string,
    opt: NotificationOptions,
  ): Notification {
    sendNotify('create', title, opt);
    const instance = new OldNotify(title, opt);
    instance.addEventListener('click', () => {
      sendNotify('click');
    });
    return instance;
  };
  newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
  Object.defineProperty(newNotify, 'permission', {
    get: () => OldNotify.permission,
  });
  // @ts-expect-error Constructor vs callable shim; runtime matches wrapped Notification API.
  return newNotify;
}

/**
 * Runs in the page main world via `Function.prototype.toString`.
 * The body must not mention module bindings. tsc rewrites references to
 * exported consts as `exports.*`, and those names do not exist in the page.
 */
export function installNotificationShimInPage(token: string): void {
  const installedKey = '__outtakeNotificationShimInstalled';
  const legacyInstalledKey = '__nativefierNotificationShimInstalled';
  const tokenKey = '__outtakeShimToken';
  const legacyTokenKey = '__nativefierShimToken';
  const originalKey = '__outtakeOriginalNotification';
  const legacyOriginalKey = '__nativefierOriginalNotification';
  const channel = 'outtake:notify:v1';
  const legacyChannel = 'nativefier:notify:v1';

  const w = window as Window & typeof globalThis & Record<string, unknown>;

  const installed =
    (w[installedKey] && w[tokenKey] === token) ||
    (w[legacyInstalledKey] && w[legacyTokenKey] === token);
  if (installed) {
    return;
  }

  const OldNotify = (w[originalKey] ??
    w[legacyOriginalKey] ??
    window.Notification) as typeof Notification;
  if (!w[originalKey]) {
    w[originalKey] = OldNotify;
  }
  if (!w[legacyOriginalKey]) {
    w[legacyOriginalKey] = OldNotify;
  }

  const sendNotify = (
    op: 'create' | 'click',
    title?: string,
    opt?: NotificationOptions,
  ): void => {
    window.postMessage({ channel, token, op, title, opt }, '*');
    window.postMessage({ channel: legacyChannel, token, op, title, opt }, '*');
  };

  const newNotify = function (
    title: string,
    opt: NotificationOptions,
  ): Notification {
    sendNotify('create', title, opt);
    const instance = new OldNotify(title, opt);
    instance.addEventListener('click', () => {
      sendNotify('click');
    });
    return instance;
  };
  newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
  Object.defineProperty(newNotify, 'permission', {
    get: () => OldNotify.permission,
  });

  window.Notification = newNotify as unknown as typeof Notification;
  w[installedKey] = true;
  w[tokenKey] = token;
  w[legacyInstalledKey] = true;
  w[legacyTokenKey] = token;
}

export function buildNotificationShimInstallScript(token: string): string {
  return `(${installNotificationShimInPage.toString()})(${JSON.stringify(token)})`;
}
