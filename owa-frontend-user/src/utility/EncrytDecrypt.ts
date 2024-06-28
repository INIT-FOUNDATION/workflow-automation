import CryptoJS from 'crypto-js';

const secretKey = 'OWA@$#&*(!@%^&';

export const encrypt = (message: string) => {
  const ciphertext = CryptoJS.AES.encrypt(message, secretKey).toString();
  return ciphertext;
};

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};