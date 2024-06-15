export const AUTH = {
    SECRET_KEY: "OWA_2024",
    ENFORCE_ONLY_ONE_SESSION: process.env.INIT_COMMON_ENFORCE_ONLY_ONE_SESSION,
    API: {
       PUBLIC: [
         "/api/v1/auth/health",
         "/api/v1/auth/admin/login",
         "/api/v1/auth/admin/getForgetPasswordOtp",
         "/api/v1/auth/admin/verifyForgetPasswordOtp",
         "/api/v1/auth/admin/resetForgetPassword"
       ]
    }
}
