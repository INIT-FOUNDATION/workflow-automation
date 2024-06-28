import { Preferences } from "@capacitor/preferences";
import { isPlatform } from "@ionic/react";

const isMobile = isPlatform("cordova");
const DICT = "OWA_APP_PREFERENCES";

const setValue = (a_key: string, a_value: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.set({ key, value: a_value })
        .then(() => resolve(true))
        .catch((error: any) => reject(error));
    } else {
      localStorage.setItem(key, a_value);
      resolve(true);
    }
  });
};

const getValue = (a_key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.get({ key })
        .then((res: { value: string | PromiseLike<string | null> | null }) =>
          resolve(res.value)
        )
        .catch((error: any) => reject(error));
    } else {
      const data = localStorage.getItem(key);
      resolve(data);
    }
  });
};

const removeKey = (a_key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.remove({ key })
        .then(() => resolve())
        .catch((error: any) => reject(error));
    } else {
      localStorage.removeItem(key);
      resolve();
    }
  });
};

const clearAll = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (isMobile) {
      Preferences.clear()
        .then(() => resolve(true))
        .catch((error: any) => reject(error));
    } else {
      localStorage.clear();
      resolve(true);
    }
  });
};

export { setValue, getValue, clearAll, removeKey };
