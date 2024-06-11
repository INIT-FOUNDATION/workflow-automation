import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/react'

const isMobile = isPlatform('cordova');
const DICT = 'STUDENT_APP_PREFERENCES';

const setValue = (a_key, a_value) => {
  return new Promise((resolve, reject) => {
    let key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.set({
        key: key,
        value: a_value,
      }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
      resolve(true);
    } else {
      localStorage.setItem(key, a_value);
      resolve(true);
    }
  });
}


const getValue = (a_key) => {
  return new Promise((resolve, reject) => {
    let key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.get({ key: key }).then(res => {
        resolve(res.value);
      }).catch(error => {
        reject(error);
      });
    } else {
      let data = localStorage.getItem(key);
      resolve(data);
    }
  })
}

const removeKey = (a_key) => {
  return new Promise((resolve, reject) => {
    let key = `${DICT}.${a_key}`;
    if (isMobile) {
      Preferences.remove({ key: key }).then(res => {
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    } else {
      let data = localStorage.removeItem(key);
      resolve(data);
    }
  })
}

const clearAll = () => {
  return new Promise((resolve, reject) => {
    if (isMobile) {
      Preferences.clear().then(res => {
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    } else {
      localStorage.clear();
      resolve(true);
    }
  })
}

export {
  setValue,
  getValue,
  clearAll,
  removeKey
};