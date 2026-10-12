import { contextBridge, ipcRenderer } from 'electron';

const loginApi = {
  submit: (username: string, password: string): void => {
    ipcRenderer.send('login-message', [username, password]);
  },
};

contextBridge.exposeInMainWorld('outtakeLogin', loginApi);
contextBridge.exposeInMainWorld('nativefierLogin', loginApi);
