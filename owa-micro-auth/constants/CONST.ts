import CryptoJS from "crypto-js";

export const allowed_headers =
  "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

export const CACHE_TTL = {
  SHORT: 15 * 60,
  MID: 60 * 60,
  PAYMENT_LINK: 2 * 60 * 30,
  LONG: 24 * 60 * 60,
};

export const CONFIG =  {
  REDIS_EXPIRE_TIME_PWD: 28800,
  SHA256_PVT_KEY: "OWA_2024"
}

export const decryptPayload = function (reqData: string) {
  if (reqData) {
    let bytes = CryptoJS.AES.decrypt(reqData, "OWA@$#&*(!@%^&");
    return bytes.toString(CryptoJS.enc.Utf8);
  } else {
    return "";
  }
};

export const USERS_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2,
  LOCKED: 3,
  LOGGED_IN: 4,
  LOGGED_OUT: 5
}

export const DEFAULT_PASSWORD = "OWA123!@#"