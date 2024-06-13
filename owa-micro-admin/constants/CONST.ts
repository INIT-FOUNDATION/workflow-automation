  export const allowed_headers =
    "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

  export const CACHE_TTL = {
    SHORT: 15 * 60,
    MID: 60 * 60,
    PAYMENT_LINK: 2 * 60 * 30,
    LONG: 24 * 60 * 60,
  };

  export const ROLES_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2
  }

  export const USERS_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2,
    LOCKED: 3,
    LOGGED_IN: 4
  }

  export const GENDER = {
    MALE: 1,
    FEMALE: 2,
    OTHERS: 3
  }
  
  export const MENUS_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2
  }

  export const DEPARTMENTS_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2
  }

  export const APP_VERSION_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    UNDER_MAINTENANCE: 2
  }

  export const USER_DEPARMENT_ASSOCIATION_STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
  }