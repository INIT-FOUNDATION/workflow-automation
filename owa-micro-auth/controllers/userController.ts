import { Response } from "express";
import { Request } from "../types/express";
import { validateLoginDetails } from "../models/userModel";
import { STATUS, redis, logger, generateToken, envUtils } from "owa-micro-common";
import { AUTH } from "../constants/ERRORCODE";
import { AUTH as AUTHENTICATION } from "../constants/AUTH";
import { DEFAULT_PASSWORD, USERS_STATUS, decryptPayload, OTPREASONS } from "../constants/CONST";
import { userService } from "../services/userService";
import jwt from "jsonwebtoken";
import { IUser } from "../types/custom";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const userController = {
    login: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Employee User']
                #swagger.summary = 'Employee User Login'
                #swagger.description = 'Endpoint for Employee User Login'
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
            const levels = ['Employee','Department'];
            if(!levels.includes(req.body.level)) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00013);
            const { error } = await validateLoginDetails(req.body);

            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: AUTH.AUTH00000, errorMessage: error.message });
            }

            const existingUser: IUser = await userService.getUserByUserName(user.user_name);
            if (!existingUser) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);
            
            // user.password = decryptPayload(user.password);
            if (user.password == DEFAULT_PASSWORD) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00002);
            
            const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
            if (isPasswordValid) {
                const expiryTime = envUtils.getNumberEnvVariableOrDefault("OWA_AUTH_TOKEN_EXPIRY_TIME", 8);
                const tokenDetails = {
                    user_id: existingUser.user_id,
                    user_name: existingUser.user_name,
                    email_id: existingUser.email_id,
                    level: existingUser.level
                }
                const token = await generateToken.generate(existingUser.user_name, tokenDetails, expiryTime, AUTHENTICATION.SECRET_KEY, req);
                userService.updateUserLoginStatus(USERS_STATUS.LOGGED_IN, req.body.user_name);

                return res.status(STATUS.OK).send({
                    data: { token: token.encoded, expiryTime: `${expiryTime}h`},
                    message: "Employee User Logged in Successfully"
                })
            } else {
                const currentInvalidAttempts = await userService.getInvalidLoginAttempts(user.user_name);
                const maximumInvalidAttempts = await userService.getMaxInvalidLoginAttempts();

                if (maximumInvalidAttempts > currentInvalidAttempts) {
                    await userService.incrementInvalidLoginAttempts(user.user_name);
                    return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);
                } else {
                    await userService.setUserInActive(user.user_name);
                    return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00003);
                }
            }
        } catch (error) {
            logger.error(`userController :: login :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    generateOTP: async (req: Request, res: Response): Promise<Response> => {
        try{
            /*  
                #swagger.tags = ['Employee User']
                #swagger.summary = 'Generate Otp'
                #swagger.description = 'Endpoint to Generate Otp for User'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        mobile: '8169104556',
                        password: 'encyrptedPasswordHash'
                    }
                } 
            */
                const mobileNumber = req.body.mobile;

                if (!mobileNumber || mobileNumber.toString().length != 10) {
                    return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00014);
                }

                const key = `Reg_Mob_${mobileNumber}`
                const redisResult = await redis.GetKeys(key);

                if (redisResult && redisResult.length > 0) {
                    const result = await redis.GetRedis(key);
                    const otpRes = JSON.parse(result);
                    return res.status(STATUS.OK).send({ txnId: otpRes.txnId, otp: otpRes.otp })
                }

                const new_txn_id = uuidv4();
                const otp = Math.floor(100000 + Math.random() * 900000);

                const otpData = {
                    mobile_no: mobileNumber,
                    otp: otp,
                    reason: OTPREASONS.VERIFYMOBNO,
                    is_active: 1,
                    date_created: new Date(),
                    date_modified: new Date()
                };

                const userData = mobileNumber;
                userData.otp = otpData.otp;
                userData.txnId = new_txn_id;

                userService.setUserInRedisByTxnId(userData);

                userService.setUserInRedisForReg(mobileNumber, userData, function (err, result) {
                    console.log(err);
                    if (err) {
                        return res.status(STATUS.BAD_REQUEST).send("OTP Already Sent");
                    } else {
                        console.log("result", result);
                        res.status(STATUS.OK).send({ "txnId": new_txn_id, "otp": otp });
                    }
                });
        } catch (error) {
            logger.error(`userController :: generateOTP :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    validateOTP: async (req: Request, res: Response): Promise<Response> => {
        try{
            /*  
                #swagger.tags = ['Employee User']
                #swagger.summary = 'Validate Otp'
                #swagger.description = 'Endpoint to Validate Otp for User'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const otp = req.body.otp;
            const txnId = req.body.txnId;
        
            if (!otp) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00015);
            if (!txnId) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00016);
            const key = `EmployeeUser|txnId:${txnId}`;

            const redisResult = await redis.GetKeys(key);

            if (!redisResult || redisResult.length == 0) {
                return res.status(STATUS.UNAUTHORIZED).send("Unauthenticated access!");
            }

            const result = await redis.GetRedis(key);
            const UserData = JSON.parse(result);
            const mobileKey = `Reg_Mob_${UserData.ben_mobile_number}`

            if (UserData.otp != otp)return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00017);
            else {
                let userObj = {};

                if (UserData._id) {
                    userObj = {
                        user_name: UserData._id,
                        user_id: UserData._id,
                        mobile_number: UserData.mobile_number,
                        txnId: txnId,
                        isNewAccount: "N"
                    }

                } else {
                    userObj = {
                        user_name: "Login|" + UserData.mobile_number,
                        mobile_number: UserData.mobile_number,
                        txnId: txnId,
                        isNewAccount: "Y"
                    }
                }

                const tokenData = await generateToken.generateTokenWithRefId(userObj, req)

                redis.deleteKey(key);
                redis.deleteKey(mobileKey);

                return res.status(STATUS.OK).send({ token: tokenData.encoded, userObj });
            }
        } catch (error) {
            logger.error(`userController :: validateOTP :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    logout: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Employee User']
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
            await userService.updateUserLoginStatus(USERS_STATUS.LOGGED_OUT, userName);
            redis.deleteRedis(userName);
            redis.deleteRedis(`USER_PERMISSIONS_${userName}`);
            redis.deleteRedis(`LOGGED_IN_USER_DETAILS_${userName}`);
            redis.deleteRedis(`EmployeeUser|Username:${userName}`);
            redis.deleteRedis(`COMBINED_ACCESS_LIST|USER:${userName}`);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Employee User Logged out Successfully"
            });
        } catch (error) {
            logger.error(`userController :: logout :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    }
}