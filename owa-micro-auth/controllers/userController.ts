import { Response } from "express";
import { Request } from "../types/express";
import { validateLoginDetails } from "../models/userModel";
import { STATUS, redis, logger, generateToken, envUtils } from "owa-micro-common";
import { AUTH } from "../constants/ERRORCODE";
import { AUTH as AUTHENTICATION } from "../constants/AUTH";
import { DEFAULT_PASSWORD, USERS_STATUS, decryptPayload, OTPREASONS } from "../constants/CONST";
import { userService } from "../services/userService";
import { IUser } from "../types/custom";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export const userController = {
    login: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Mobile User']
                #swagger.summary = 'Mobile User Login'
                #swagger.description = 'Endpoint for Mobile User Login'
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

            const existingUser: IUser = await userService.getUserByUserName(user.user_name);
            if (!existingUser) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);

            const levels = ['Employee', 'Department'];
            if (!levels.includes(existingUser.level)) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);

            user.password = decryptPayload(user.password);
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
                    data: { token: token.encoded, expiryTime: `${expiryTime}h` },
                    message: "User Logged in Successfully"
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
        try {
            /*  
                #swagger.tags = ['Mobile User']
                #swagger.summary = 'Generate Otp'
                #swagger.description = 'Endpoint to Generate Otp for Mobile User'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        mobile_number: '8169104556'
                    }
                } 
            */
            const mobileNumber = req.body.mobile_number;

            if (!mobileNumber || mobileNumber.toString().length != 10) {
                return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00014);
            }
            
            const existingUser: IUser = await userService.getUserByUserName(mobileNumber);
            if (!existingUser) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);

            const levels = ['Employee', 'Department'];
            if (!levels.includes(existingUser.level)) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00001);

            const key = `Mob_User|Mobile:${mobileNumber}`
            const redisResult = await redis.GetKeys(key);

            if (redisResult && redisResult.length > 0) {
                const result = await redis.GetRedis(key);
                const otpRes = JSON.parse(result);
                return res.status(STATUS.OK).send({ txnId: otpRes.txnId, otp: otpRes.otp })
            }

            const new_txn_id = uuidv4();
            const otp = Math.floor(100000 + Math.random() * 900000);

            let userData = {
                user_id: existingUser.user_id,
                user_name: mobileNumber,
                email_id: existingUser.email_id,
                level: existingUser.level,
                txnId: new_txn_id,
                otp: otp
            };;
            
            userService.setUserInRedisByTxnId(userData);

            userService.setUserInRedisForReg(mobileNumber, userData, function (err, result) {
                if (err) {
                    return res.status(STATUS.BAD_REQUEST).send("OTP Already Sent");
                } else {
                    return res.status(STATUS.OK).send({ "txnId": new_txn_id, "otp": otp });
                }
            });
        } catch (error) {
            logger.error(`userController :: generateOTP :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    validateOTP: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Mobile User']
                #swagger.summary = 'Validate Otp'
                #swagger.description = 'Endpoint to Validate Otp for Mobile User'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        otp: 'encryptedHash',
                        txnId: 'f3a8288c-3c6d-4507-b2cd-b4c9aeaa9752'
                    }
                }     
            */
            let otp = req.body.otp;
            const txnId = req.body.txnId;

            if (!otp) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00015);
            if (!txnId) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00016);

            const key = `Mob_User|TxnId:${txnId}`;

            const redisResult = await redis.GetKeys(key);
            
            if (!redisResult || redisResult.length == 0) {
                return res.status(STATUS.UNAUTHORIZED).send(AUTH.AUTH00018);
            }

            const result = await redis.GetRedis(key);
            const userData = JSON.parse(result);
            const mobileKey = `Mob_User|Mobile:${userData.mobile_number}`

            otp = decryptPayload(otp);
            
            if (userData.otp != otp) return res.status(STATUS.BAD_REQUEST).send(AUTH.AUTH00017);
            else {
                const expiryTime = envUtils.getNumberEnvVariableOrDefault("OWA_AUTH_TOKEN_EXPIRY_TIME", 8);

                const tokenDetails = {
                    user_id: userData.user_id,
                    user_name: userData.user_name,
                    email_id: userData.email_id,
                    level: userData.level
                }
                const token = await generateToken.generate(userData.user_name, tokenDetails, expiryTime, AUTHENTICATION.SECRET_KEY, req);

                redis.deleteRedis(key);
                redis.deleteRedis(mobileKey);

                return res.status(STATUS.OK).send({
                    data: { token: token.encoded, expiryTime: `${expiryTime}h` },
                    message: "User Logged in Successfully"
                })
            }
        } catch (error) {
            logger.error(`userController :: validateOTP :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    },
    logout: async (req: Request, res: Response): Promise<Response> => {
        try {
            /*  
                #swagger.tags = ['Mobile User']
                #swagger.summary = 'Logout User'
                #swagger.description = 'Endpoint to Logout Mobile User'
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
            redis.deleteRedis(`Mob_User|Username:${userName}`);
            redis.deleteRedis(`COMBINED_ACCESS_LIST|USER:${userName}`);
            return res.status(STATUS.OK).send({
                data: null,
                message: "User Logged out Successfully"
            });
        } catch (error) {
            logger.error(`userController :: logout :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(AUTH.AUTH00000);
        }
    }
}