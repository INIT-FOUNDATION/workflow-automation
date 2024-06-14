import { IUser } from "../types/custom";
import { CACHE_TTL } from "../constants/CONST";
import { redis, logger, pg, passwordPolicy, generateToken } from "owa-micro-common";
import { config } from "../constants/config";
import { decryptPayload, SERVICES } from "../constants/CONST";

import { USER } from "../constants/QUERY";

import { ERRORCODE } from "../constants/ERRORCODE";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

export const adminService = {
    getUserInRedisByUserName: async (username : string): Promise<string> => {
        let key = `User|Username:${username}`
        let result = await redis.GetKeyRedis(key);
        return result;
    },
    setUserInRedisByUserNameForLogin: async (username : string, userObj: IUser[]) => {
        if (userObj && userObj[0]) {
            redis.SetRedis(`User|Username:${username}`, userObj, config.REDIS_EXPIRE_TIME_PWD)
        }
    },
    setForgotPasswordOTPInRedis: async (userData: any) => {
    try{
        if (userData != undefined && userData != null) {
            let txnId = userData.txnId;
    
            redis.SetRedis(`Admin_Forgot_Password|User:${userData.user_name}`, userData, 180)
            redis.SetRedis(`Admin_Forgot_Password|txnId:${txnId}`, userData, 180)
            
        };
    } catch (error) {
        throw new Error(error.message);  
    }
    },
    shareForgotOTPUserDetails: async (userDetails: any) => {
        let mobileNumber = userDetails.mobile_no;
        // let eduName = await commonService.getEduName(userDetails);
        // let message = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.body;
        // let templateId = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.template_id;
        // let time = CONST.SMS_TEMPLATES.ADMIN_FORGOT_PASSWORD.time;
        // message = message.replace("<OTP>", userDetails.otp)
        //                 .replace("<TIME>", time)
        //                 .replace("<EDUNAME>", eduName);

        // console.log("message, mobileNumber, templateId", message, mobileNumber, templateId);
        // await communicationUtil.sendSMS(message, mobileNumber, templateId);
    },
    getRoleModuleList: async (role_id: number): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.selectRoleDetailsQueryByRoleId,
                values: [role_id]
            };
    
            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult[0];
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.getInvalidAttempts,
                values: [user_name]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    getMaxInvalidLoginAttempts: async (): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.getMaxInvalidLoginAttempts,
                values: []
            }; 
            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    incrementInvalidLoginAttempts: async (user_name: string): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.incrementInvalidAttempts,
                values: [user_name]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    setUserInactive: async (user_name: string): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.setUserInactive,
                values: [user_name]
            };

            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    checkUser: async (username: string): Promise<IUser[]> => {
        try {
            let redis_result = await adminService.getUserInRedisByUserName(username);

            const parseResult: IUser[] =  JSON.parse(redis_result);
            if (redis_result && parseResult.length && parseResult[0].account_locked != 1) {
                return parseResult;
            } else {
                const _query = {
                    text: USER.selectUserQuery,
                    values: [username]
                };
                const queryResult: IUser[]= await pg.executeQueryPromise(_query);
                adminService.setUserInRedisByUserNameForLogin(username, queryResult);
                return queryResult;
            }  
        } catch (error) {
            throw new Error(error.message);
        }
        
    },
    updateUserLoggedInOut: async (isLoggedIn: number, userName: string): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.updateUserLoggedInOut,
                values: [isLoggedIn, userName]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            return queryResult;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    resetPassword: async (newPassword: string, mobileNumber : number): Promise<IUser[]> => {
        try {
            const _query = {
                text: USER.resetPasswordQuery,
                values: [newPassword,mobileNumber]
            };
            const result = await pg.executeQueryPromise(_query);
            return result;
        } catch (error) {
            throw new Error(error.message);  
        }
    },
    login: async (user: IUser): Promise<IUser[]> => {
        try {
            let redis_result = await adminService.getUserInRedisByUserName(user.user_name);
            const parseResult: IUser[]= redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;
    
            if (redis_result && parseResult.length && parseResult[0].account_locked != 1) {
                return parseResult
            }
    
            const _query = {
                text: USER.selectUserQuery,
                values: [user.user_name]
            };
           
            const userResponse = await pg.executeQueryPromise(_query);
            if (!userResponse[0]) {
                throw new Error(ERRORCODE.USRAUT0001);
            }

            const userId = userResponse[0].user_id;
            logger.debug(`authService :: login :: user Id :: ${JSON.stringify(userId)}`)
            logger.debug(`authService :: login :: userResponse :: ${JSON.stringify(userResponse[0])}`)
            const userRoleModuleData = await adminService.getRoleModuleList(userResponse[0].role_id)
            const userData = userResponse[0];
            const type = 1;
            logger.debug(`authService :: login :: userData ::  ${JSON.stringify(userData)}`)
            // user.password = decryptPayload(user.password);
            if (user.password == SERVICES.default_pass) {
                throw new Error(ERRORCODE.USRAUT0007)
            }

            const validPassword = await bcrypt.compare(user.password, userData.password);
            const policy = await passwordPolicy.validate_password(userId, user.password, type);

            logger.debug(`authService :: login :: validPassword ::  ${JSON.stringify(validPassword)}`)
            logger.debug(`authService :: login :: policy ::  ${JSON.stringify(policy)}`)

            if (validPassword && policy.status == true) {
                const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, user)
                return token.encoded;
            }

            const [invalidAttemptsData] = await adminService.getInvalidLoginAttempts(user.user_name);
            const invalidAttempts = invalidAttemptsData.invalid_attempts;
            const [maxInvalidAttemptsData] = await adminService.getMaxInvalidLoginAttempts();
            const maxInvalidAttempts = maxInvalidAttemptsData.max_invalid_attempts;

            if (maxInvalidAttempts > invalidAttempts) {
                await adminService.incrementInvalidLoginAttempts(user.user_name);
            } else {
                await adminService.setUserInactive(user.user_name);
                throw new Error(ERRORCODE.USRAUT0005);
            }
        } catch (error) {
            logger.error(`adminService :: login :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    getForgetPasswordOtp: async (mobile_number: string): Promise<string> => {
    try{
        let redis_result = await adminService.getUserInRedisByUserName(mobile_number);
            const parseResult: IUser[] = redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;
    
            if (redis_result && parseResult.length && parseResult[0].account_locked != 1) {
                return redis_result
            }
    
            const _query = {
                text: USER.selectUserQuery,
                values: [mobile_number]
            };
            const phoneNumberExists = await pg.executeQueryPromise(_query);
            if (!phoneNumberExists[0]) {
                const txnId = uuidv4()
                return txnId;
            }
      
            let key = `Admin_Forgot_Password|User:${mobile_number}`;
            let redisResult = await redis.GetRedis(key);
      
            if (redisResult[0]) {
                throw new Error("OTP Already Sent!");
            } else {
                let new_txn_id = uuidv4();
                let otp = Math.floor(100000 + Math.random() * 900000);
      
                let userdata = {
                        user_name : mobile_number,
                        txnId : new_txn_id,
                        otp : otp,
                        mobile_no : mobile_number
                    };
      
                adminService.setForgotPasswordOTPInRedis(userdata);
                await adminService.shareForgotOTPUserDetails(userdata);
                return new_txn_id;
            }
        }catch(err){
            logger.error(`adminService :: getForgetPasswordOtp :: ${err.message} :: ${err}`)
            throw new Error(err.message);
        }
    },
    verifyForgetPasswordOtp: async (txnId: string, otp: string): Promise<IUser[]> => {
        try {
       
        let key = `Admin_Forgot_Password|txnId:${txnId}`;
        let redisResult = await redis.GetRedis(key);
    
        if (redisResult) {
            let UserData = JSON.parse(redisResult);
            if (UserData.otp != parseInt(otp) || UserData.txnId !== txnId.toString()) {
                throw new Error (ERRORCODE.USRAUT0014);
            } else {
                let user_name = UserData.user_name;
                const checkUserData = await adminService.checkUser(user_name);
                if (checkUserData[0]) {
                    let new_txnId = uuidv4();
                    let mobile_key = `Admin_Forgot_Password|User:${user_name}`;
                    let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${new_txnId}`;
                    await redis.deleteKey(mobile_key);
                    await redis.deleteKey(key);
                    redis.SetRedis(forgotPasswordChangeKey, { user_name }, 180);
                    return new_txnId;
                } else {
                    throw new Error (ERRORCODE.USRAUT0014);
                }
            }
            } else {
                throw new Error (ERRORCODE.USRAUT0014);
            }   
        } catch (error) {
            logger.error(`adminService :: getForgetPasswordOtp :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    },
    resetForgetPassword: async (reqData: IUser) => {
        try{
            const redisResult = await redis.GetRedis(`FORGOT_PASSWORD_CHANGE_${reqData.txnId}`);

            if (!redisResult) {
                throw new Error("Invalid forgot password request");
            }

            let userData;
            try {
                userData = JSON.parse(redisResult);
            } catch (error) {
               throw new Error("Invalid Forgot Password Request");
            }

            if (!userData || !userData.user_name) {
               throw new Error("Mobile number not found");
            }

            const mobileNumber = userData.user_name;

            const hashedPassword = await bcrypt.hash(reqData.new_password, 10);

            const passwordUpdated = await adminService.resetPassword(hashedPassword, mobileNumber);

            if (passwordUpdated) {
                await redis.deleteKey(`FORGOT_PASSWORD_CHANGE_${reqData.txnId}`);
                await redis.deleteKey(`Admin_Forgot_Password|User:${mobileNumber}`);
                await redis.deleteKey(`User|Username:${mobileNumber}`);
                await redis.deleteKey(mobileNumber);
                return ({ message: 'Password updated successfully' });
            } else {
                return ({ "error": 'Password Reset Timeout'});
            }
        }catch (error) {
            logger.error(`adminService :: resetForgetPassword :: ${error.message} :: ${error}`)
            throw new Error(error)
        }
    }

}