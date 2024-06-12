  import {CryptoJS} from "crypto-js";

  export const allowed_headers =
    "Content-Type, Authorization, offline_mode, uo-device-type, uo-os, uo-os-version, uo-is-mobile, uo-is-tablet, uo-is-desktop, uo-browser-version, uo-browser, uo-client-id, uo-client-ip";

  export const CACHE_TTL = {
    SHORT: 15 * 60,
    MID: 60 * 60,
    PAYMENT_LINK: 2 * 60 * 30,
    LONG: 24 * 60 * 60,
  };

  export const decryptPayload = function(reqData : string) {
    if (reqData) {
        let bytes = CryptoJS.AES.decrypt(reqData, "EDU@$#&*(!@%^&");
        return bytes.toString(CryptoJS.enc.Utf8);
    } else {
        return "";
    }
};

export const SERVICES = {
  MOBILE: "+91<mobile@anchal.com>",
  OTP_TRIALS: 3,
  NEXT_OTP: 60,
  email_To: "email_To",
  emailTo_feedback: "emailTo_feedback",
  newUser_sms: "newUser_sms",
  forgotPwd_sms: "forgotPwd_sms",
  update_mobno_sms: "update_mobno_sms",
  resetUser_sms: "resetUser_sms",
  verify_mobno_sms: "verify_sms",
  register_sms: "register_sms",
  session_sms: "session_sms",
  default_pass: "OWA_123",
  campaign_id: "3737373",
  EDU_audit_logs_localFile_maxSize: 1
};
