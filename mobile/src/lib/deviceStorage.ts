/** The web preview of the app keeps its state in localStorage (the phone uses deviceStorage.native.ts). */
export const deviceStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
};
