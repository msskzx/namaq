import Storage from 'expo-sqlite/kv-store';

/** The phone's key-value store, read synchronously so a screen opens where it was left. */
export const deviceStorage = {
  getItem: (key: string) => Storage.getItemSync(key),
  setItem: (key: string, value: string) => Storage.setItemSync(key, value),
};
