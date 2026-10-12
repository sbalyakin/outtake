import { contextBridge, IpcRenderer } from 'electron';

import type { SessionInteractionRequest } from '../adapters/sessionAdapter';

export type SessionInteractionResult = {
  id?: string;
  value?: unknown;
  error?: Error | { message?: string };
};

export type OuttakeSessionBridge = {
  get<T = unknown>(property: string, options?: { id?: string }): Promise<T>;
  set(
    property: string,
    propertyValue: unknown,
    options?: { id?: string },
  ): Promise<unknown>;
  call<T = unknown>(
    func: string,
    funcArgs?: unknown[],
    options?: { id?: string },
  ): Promise<T>;
};

export type OuttakeBridge = {
  session: OuttakeSessionBridge;
};

/** @deprecated Use {@link OuttakeSessionBridge}. */
export type NativefierSessionBridge = OuttakeSessionBridge;

/** @deprecated Use {@link OuttakeBridge}. */
export type NativefierBridge = OuttakeBridge;

let sessionRequestCounter = 0;

function createSessionRequestId(explicit?: string): string {
  return explicit ?? `outtake-session-${++sessionRequestCounter}`;
}

function rejectSessionError(
  result: SessionInteractionResult,
): Error | undefined {
  if (result.error === undefined) {
    return undefined;
  }
  if (result.error instanceof Error) {
    return result.error;
  }
  const message =
    typeof result.error === 'object' &&
    result.error !== null &&
    'message' in result.error
      ? String((result.error as { message?: string }).message)
      : JSON.stringify(result.error);
  return new Error(message);
}

export function sendSessionInteraction(
  ipcRenderer: IpcRenderer,
  request: SessionInteractionRequest,
): Promise<SessionInteractionResult> {
  const id = createSessionRequestId(request.id);
  const payload: SessionInteractionRequest = { ...request, id };

  return new Promise((resolve, reject) => {
    const onReply = (
      _event: unknown,
      result: SessionInteractionResult,
    ): void => {
      if (result.id !== undefined && result.id !== id) {
        return;
      }
      ipcRenderer.removeListener('session-interaction-reply', onReply);
      const err = rejectSessionError(result);
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    };

    ipcRenderer.on('session-interaction-reply', onReply);
    ipcRenderer.send('session-interaction', payload);
  });
}

export function createOuttakeSessionBridge(
  ipcRenderer: IpcRenderer,
): OuttakeSessionBridge {
  return {
    get<T = unknown>(property: string, options?: { id?: string }): Promise<T> {
      return sendSessionInteraction(ipcRenderer, {
        property,
        id: options?.id,
      }).then((result) => result.value as T);
    },
    set(
      property: string,
      propertyValue: unknown,
      options?: { id?: string },
    ): Promise<unknown> {
      return sendSessionInteraction(ipcRenderer, {
        property,
        propertyValue,
        id: options?.id,
      }).then((result) => result.value);
    },
    call<T = unknown>(
      func: string,
      funcArgs?: unknown[],
      options?: { id?: string },
    ): Promise<T> {
      return sendSessionInteraction(ipcRenderer, {
        func,
        funcArgs,
        id: options?.id,
      }).then((result) => result.value as T);
    },
  };
}

/** @deprecated Use {@link createOuttakeSessionBridge}. */
export const createNativefierSessionBridge = createOuttakeSessionBridge;

export function createOuttakeBridge(ipcRenderer: IpcRenderer): OuttakeBridge {
  return {
    session: createOuttakeSessionBridge(ipcRenderer),
  };
}

/** @deprecated Use {@link createOuttakeBridge}. */
export const createNativefierBridge = createOuttakeBridge;

export function exposeOuttakeBridge(bridge: OuttakeBridge): void {
  if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('outtake', bridge);
    contextBridge.exposeInMainWorld('nativefier', bridge);
    return;
  }
  const w = window as Window &
    typeof globalThis & {
      outtake?: OuttakeBridge;
      nativefier?: OuttakeBridge;
    };
  w.outtake = bridge;
  w.nativefier = bridge;
}

/** @deprecated Use {@link exposeOuttakeBridge}. */
export const exposeNativefierBridge = exposeOuttakeBridge;

export function assignPreloadOuttakeGlobal(bridge: OuttakeBridge): void {
  const g = globalThis as typeof globalThis & {
    outtake?: OuttakeBridge;
    nativefier?: OuttakeBridge;
  };
  g.outtake = bridge;
  g.nativefier = bridge;
}

/** @deprecated Use {@link assignPreloadOuttakeGlobal}. */
export const assignPreloadNativefierGlobal = assignPreloadOuttakeGlobal;

export function setupOuttakeBridge(ipcRenderer: IpcRenderer): OuttakeBridge {
  const bridge = createOuttakeBridge(ipcRenderer);
  exposeOuttakeBridge(bridge);
  assignPreloadOuttakeGlobal(bridge);
  return bridge;
}

/** @deprecated Use {@link setupOuttakeBridge}. */
export const setupNativefierBridge = setupOuttakeBridge;
