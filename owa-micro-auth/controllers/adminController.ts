import { Response } from "express";
import { Request } from "../types/express";
import { validateLoginDetails, validateResetPassword, validateVerifyForgotPassword } from "../models/adminModel";
import { STATUS, redis, logger, generateToken, envUtils } from "owa-micro-common";
import { AUTH } from "../constants/ERRORCODE";
import { AUTH as AUTHENTICATION } from "../constants/AUTH";
import { DEFAULT_PASSWORD, USERS_STATUS, decryptPayload } from "../constants/CONST";
import { adminService } from "../services/adminService";
import jwt from "jsonwebtoken";
import { IUser } from "../types/custom";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const adminController = {
    validateToken: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Validate Token'
                #swagger.description = 'Endpoint to Validate Token'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const token = req.header("authorization");
            jwt.verify(token, AUTHENTICATION.SECRET_KEY);
            return res.status(STATUS.OK).send({ data: null, message: "Token Validated Successfully" });
        } catch (error) {
            logger.error(`adminController :: validateToken :: ${error.message} :: ${error}`)
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    login: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'User Login'
                #swagger.description = 'Endpoint for User Login'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        user_name: '8169104556',
                        password: 'encyrptedPasswordHash'
                    }
                }    
            */
            const user: IUser = req.body;
            const { error } = await validateLoginDetails(req.body);

            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.message });
            }

            const existingUser: IUser = await adminService.getUserByUserName(user.user_name);
            if (!existingUser) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);
            
            user.password = decryptPayload(user.password);
            if (user.password == DEFAULT_PASSWORD) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00002);
            
            const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
            if (isPasswordValid) {
                const expiryTime = envUtils.getNumberEnvVariableOrDefault("OWA_AUTH_TOKEN_EXPIRY_TIME", 8);
                const tokenDetails = {
                    user_id: existingUser.user_id,
                    department_id: existingUser.department_id,
                    role_id: existingUser.role_id,
                    user_name: existingUser.user_name,
                    email_id: existingUser.email_id,
                    level: existingUser.level
                }
                const token = await generateToken.generate(existingUser.user_name, tokenDetails, expiryTime, AUTHENTICATION.SECRET_KEY, req);
                adminService.updateUserLoginStatus(USERS_STATUS.LOGGED_IN, req.body.user_name);

                return res.status(STATUS.OK).send({
                    data: { token: token.encoded, expiryTime: `${expiryTime}h`},
                    message: "User Logged in Successfully"
                })
            } else {
                const currentInvalidAttempts = await adminService.getInvalidLoginAttempts(user.user_name);
                const maximumInvalidAttempts = await adminService.getMaxInvalidLoginAttempts();

                if (maximumInvalidAttempts > currentInvalidAttempts) {
                    await adminService.incrementInvalidLoginAttempts(user.user_name);
                    return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);
                } else {
                    await adminService.setUserInActive(user.user_name);
                    return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00003);
                }
            }
        } catch (error) {
            logger.error(`adminController :: login :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    logout: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Logout User'
                #swagger.description = 'Endpoint to Logout User'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const userName = req.plainToken.user_name;
            await adminService.updateUserLoginStatus(USERS_STATUS.LOGGED_OUT, userName);
            redis.deleteRedis(userName);
            redis.deleteRedis(`USER_PERMISSIONS_${userName}`);
            redis.deleteRedis(`LOGGED_IN_USER_DETAILS_${userName}`);
            redis.deleteRedis(`User|Username:${userName}`);
            redis.deleteRedis(`COMBINED_ACCESS_LIST|USER:${userName}`);
            return res.status(STATUS.OK).send({
                data: null,
                message: "User Logged out Successfully"
            });
        } catch (error) {
            logger.error(`adminController :: logout :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    getForgetPasswordOtp: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Get Forgot Password Otp'
                #swagger.description = 'Endpoint to Generate OTP for Forgot Password'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        mobile_number: 8169104556
                    }
                }    
            */
            let mobile_number = req.body.mobile_number;
            if (!mobile_number || mobile_number.toString().length !== 10) {
                return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00004);
            }

            const userExists = await adminService.existsByMobileNumber(mobile_number);
            if (!userExists) {
                logger.error(`adminController :: getForgetPasswordOtp :: mobile number :: ${mobile_number} :: Password doesn't exist`);
                return res.status(STATUS.OK).send({data: { txnId: uuidv4() }, message: "Generated Forget Password OTP Successfully"});
            }

            const alreadySent = await adminService.isForgotPasswordOtpAlreadySent(mobile_number);
            if (alreadySent) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00006);

            const txnId = await adminService.getForgetPasswordOtp(mobile_number);

            return res.status(STATUS.OK).send({
                data: { txnId },
                message: "Generated Forget Password OTP Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: getForgetPasswordOtp :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    verifyForgetPasswordOtp: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Verify Forgot Password Otp'
                #swagger.description = 'Endpoint to Verify OTP for Forgot Password'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        otp: 123456,
                        txnId: '1b99ee36-4d23-4d0a-9972-606f48bf5e33'
                    }
                }    
            */
            const otpDetails = req.body;        
            const { error } = await validateVerifyForgotPassword(otpDetails);
            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.message });
            }

            otpDetails.otp = decryptPayload(otpDetails.otp);
            const txnId = otpDetails.txnId;

            const forgotPasswordOtpDetailsCachedResult = await adminService.getForgotPasswordOtpDetails(txnId);
            if (!forgotPasswordOtpDetailsCachedResult) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00007);

            const forgotPasswordOtpDetails = JSON.parse(forgotPasswordOtpDetailsCachedResult);
            if (forgotPasswordOtpDetails.otp != parseInt(otpDetails.otp) || forgotPasswordOtpDetails.txnId != txnId) {
                return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00007);
            }

            const newTxnId = await adminService.verifyForgetPasswordOtp(forgotPasswordOtpDetails.userName, txnId);

            return res.status(STATUS.OK).send({
                data: { txnId: newTxnId },
                message: "Verified Forget Password OTP Success Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: verifyForgetPasswordOtp :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    resetForgetPassword: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Admin']
                #swagger.summary = 'Reset Password'
                #swagger.description = 'Endpoint to Reset the Password'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        txnId: '1b99ee36-4d23-4d0a-9972-606f48bf5e33',
                        newPassword: 'encryptedPasswordHash',
                        confirmPassword: 'encryptedPasswordHash'
                    }
                }    
            */
            const resetForgetPasswordDetails = req.body;        
            const { error } = await validateResetPassword(resetForgetPasswordDetails);
            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.message });
            }

            resetForgetPasswordDetails.newPassword = decryptPayload(resetForgetPasswordDetails.newPassword);
            resetForgetPasswordDetails.confirmPassword = decryptPayload(resetForgetPasswordDetails.confirmPassword);

            if (resetForgetPasswordDetails.newPassword !== resetForgetPasswordDetails.confirmPassword) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00008);

            if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(resetForgetPasswordDetails.newPassword)) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00009);

            const forgotPasswordChangeRequestDetails = await adminService.getForgotPasswordChangeDetails(resetForgetPasswordDetails.txnId);
            if (!forgotPasswordChangeRequestDetails) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00010);
            const parsedForgotPasswordChangeRequestDetails = JSON.parse(forgotPasswordChangeRequestDetails);

            const passwordResetted = await adminService.resetForgetPassword(resetForgetPasswordDetails, parsedForgotPasswordChangeRequestDetails.userName);
            if (!passwordResetted) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00011);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Password Resetted Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: resetForgetPassword :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    }
}
