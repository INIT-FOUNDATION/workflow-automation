import { get, post } from "../utility/ApiCall";

const loginWithMobile = async (payload: any) => {
  const loginByMobile = await post("/api/v1/auth/student/getOtp", payload);
  return loginByMobile;
};

const verifyMobileOtp = async (payload: any) => {
  const verifyByMobileOtp = await post(
    "/api/v1/auth/student/verifyOtp",
    payload
  );
  return verifyByMobileOtp;
};

const loginPassword = async (payload: any) => {
  const loginByMobileRes = await post("/api/v1/auth/admin/login", payload);
  return loginByMobileRes;
};

const otpRequest = async (payload: any) => {
  const getOtpRequest = await post(
    "/api/v1/admin/getForgetPasswordOtp",
    payload
  );
  return getOtpRequest;
};
const verifyOtpRequest = async (payload: any) => {
  const getVerifyOtpRequest = await post(
    "/api/v1/admin/verifyForgetPasswordOtp",
    payload
  );
  return getVerifyOtpRequest;
};
const resetPasswordRequest = async (payload: any) => {
  const getResetPasswordRequest = await post(
    "/api/v1/admin/resetForgetPassword",
    payload
  );
  return getResetPasswordRequest;
};

const getLoggedInUserDetails = async (addUserDetailsToContext: Function) => {
  try {
    const getLoginUserInfo = await get("/api/v1/user/admin/loggedUserInfo");
    const loggedInUser = getLoginUserInfo?.data;
    addUserDetailsToContext(loggedInUser);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export {
  loginWithMobile,
  verifyMobileOtp,
  loginPassword,
  otpRequest,
  verifyOtpRequest,
  resetPasswordRequest,
  getLoggedInUserDetails,
};
