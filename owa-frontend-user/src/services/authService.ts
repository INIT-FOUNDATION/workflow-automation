import { get, post } from "../utility/ApiCall";

const loginPassword = async (payload: any) => {
  const loginByMobileRes = await post("/api/v1/auth/user/login", payload);
  return loginByMobileRes;
};

const logout = async () => {
  const logoutRes = await post("/api/v1/auth/user/logout", {});
  return logoutRes;
};

const loginWithMobile = async (payload: any) => {
  const loginByMobile = await post("/api/v1/auth/user/generateOTP", payload);
  return loginByMobile;
};

const verifyMobileOtp = async (payload: any) => {
  const verifyByMobileOtp = await post(
    "/api/v1/auth/user/validateOTP",
    payload
  );
  return verifyByMobileOtp;
};

const ForgotPaaswordRequest = async (payload: any) => {
  const getForgotPaaswordRequest = await post(
    "/api/v1/auth/admin/getForgetPasswordOtp",
    payload
  );
  return getForgotPaaswordRequest;
};

const verifyForgotPaaswordRequest = async (payload: any) => {
  const getVerifyForgotPaaswordRequest = await post(
    "/api/v1/auth/admin/verifyForgetPasswordOtp",
    payload
  );
  return getVerifyForgotPaaswordRequest;
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
  ForgotPaaswordRequest,
  verifyForgotPaaswordRequest,
  resetPasswordRequest,
  getLoggedInUserDetails,
  logout,
};
