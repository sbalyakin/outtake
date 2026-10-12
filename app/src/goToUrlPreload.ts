import { contextBridge, ipcRenderer } from 'electron';

const goToUrlApi = {
  submit: (url: string): void => {
    void ipcRenderer.invoke('go-to-url-message', url);
  },
  cancel: (): void => {
    void ipcRenderer.invoke('go-to-url-cancel');
  },
};

contextBridge.exposeInMainWorld('outtakeGoToUrl', goToUrlApi);
contextBridge.exposeInMainWorld('nativefierGoToUrl', goToUrlApi);
