import Storage from 'expo-sqlite/kv-store';

export const deviceStorage = {
  getItem: (key: string) => Storage.getItemSync(key),
  setItem: (key: string, value: string) => Storage.setItemSync(key, value),
};
