import { post } from "../utility/ApiCall";

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

  const otpRequest=async(payload: any)=>{
    const getOtpRequest=await post("/api/v1/auth/getForgetPasswordOtp",payload);
    return getOtpRequest;
  }
  const verifyOtpRequest=async(payload: any)=>{
      const getVerifyOtpRequest=await post("/api/v1/auth/verifyForgetPasswordOtp",payload);
    return getVerifyOtpRequest;
  }
  const ResetPasswordRequest=async(payload: any)=>{
    const getResetPasswordRequest=await post("/api/v1/auth/resetForgetPassword",payload);
    return getResetPasswordRequest;
  }
   

export { loginWithMobile, verifyMobileOtp, loginPassword,otpRequest, verifyOtpRequest, ResetPasswordRequest };
