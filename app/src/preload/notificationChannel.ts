export const NOTIFY_POST_MESSAGE_CHANNEL = 'outtake:notify:v1';

/** Legacy upstream channel; still accepted for dual-read compatibility. */
export const LEGACY_NOTIFY_POST_MESSAGE_CHANNEL = 'nativefier:notify:v1';

export const NOTIFY_IPC_CHANNEL = 'outtake-notify';

/** Legacy upstream IPC channel; still accepted for dual-read compatibility. */
export const LEGACY_NOTIFY_IPC_CHANNEL = 'nativefier-notify';

export const NOTIFY_POST_MESSAGE_CHANNELS = [
  NOTIFY_POST_MESSAGE_CHANNEL,
  LEGACY_NOTIFY_POST_MESSAGE_CHANNEL,
] as const;

export const NOTIFY_IPC_CHANNELS = [
  NOTIFY_IPC_CHANNEL,
  LEGACY_NOTIFY_IPC_CHANNEL,
] as const;

export type OuttakeNotifyOp = 'create' | 'click';

/** @deprecated Use {@link OuttakeNotifyOp}. */
export type NativefierNotifyOp = OuttakeNotifyOp;

export type OuttakeNotifyMessage = {
  channel:
    | typeof NOTIFY_POST_MESSAGE_CHANNEL
    | typeof LEGACY_NOTIFY_POST_MESSAGE_CHANNEL;
  token: string;
  op: OuttakeNotifyOp;
  title?: string;
  opt?: NotificationOptions;
};

/** @deprecated Use {@link OuttakeNotifyMessage}. */
export type NativefierNotifyMessage = OuttakeNotifyMessage;

export type OuttakeNotifyIpcPayload = {
  token: string;
  op: OuttakeNotifyOp;
  title?: string;
  opt?: NotificationOptions;
};

/** @deprecated Use {@link OuttakeNotifyIpcPayload}. */
export type NativefierNotifyIpcPayload = OuttakeNotifyIpcPayload;
