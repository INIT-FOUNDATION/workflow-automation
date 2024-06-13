import { IUser } from "../types/custom";
import { CACHE_TTL } from "../constants/CONST";
import { redis, logger, pg, passwordPolicy, generateToken } from "owa-micro-common";
import { user } from "../constants/config";
import { decryptPayload, SERVICES } from "../constants/CONST";

import { 
    selectUserQuery,
    getInvalidAttempts,
    setUserInactive,
    incrementInvalidAttempts,
    selectRoleDetailsQueryByRoleId,
    updateUserLoggedInOut,
    resetPasswordQuery,
    getMaxInvalidLoginAttempts
 } from "../constants/QUERY";

import { ERRORCODE } from "../constants/ERRORCODE";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";

export const authService = {
    getUserInRedisByUserName: async (username : any): Promise<IUser[]> => {
        let key = `User|Username:${username}`
        let result = await redis.GetKeyRedis(key);
        return result;
    },
    setUserInRedisByUserNameForLogin: async (username : string, userObj: any): Promise<IUser[]> => {
        if (userObj && userObj[0]) {
            redis.SetRedis(`User|Username:${username}`, userObj, user.REDIS_EXPIRE_TIME_PWD)
        }
    },
    setForgotPasswordOTPInRedis: async (userData: any): Promise<IUser[]> => {
        if (userData != undefined && userData != null) {
            let txnId = userData.txnId;
    
            redis.SetRedis(`Admin_Forgot_Password|User:${userData.user_name}`, userData, 180)
                .then()
                .catch(err => logger.error(err));
    
            redis.SetRedis(`Admin_Forgot_Password|txnId:${txnId}`, userData, 180)
                .then()
                .catch(err => logger.error(err));
        };
    },
    shareForgotOTPUserDetails: async (userDetails: any): Promise<IUser[]> => {
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
        const _query = {
            text: selectRoleDetailsQueryByRoleId,
            values: [role_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<IUser[]> => {
        const _query = {
            text: getInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                return(err);
            } else {
                return(res);
            }
        });
    },
    getMaxInvalidLoginAttempts: async (): Promise<IUser[]> => {
        const _query = {
            text: getMaxInvalidLoginAttempts,
            values: []
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                return(err);
            } else {
                return(res);
            }
        });
    },
    incrementInvalidLoginAttempts: async (user_name: string): Promise<IUser[]> => {
        const _query = {
            text: incrementInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                return(err);
            } else {
                logger.debug('increment')
                logger.debug(res);
                return(res);
            }
        });
    },
    setUserInactive: async (id: number): Promise<IUser[]> => {
        const _query = {
            text: setUserInactive,
            values: [id]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                return(err);
            } else {
                return(res[0]);
            }
        });
    },
    checkUser: async (username: string): Promise<IUser[]> => {
        let redis_result = await authService.getUserInRedisByUserName(username);

        redis_result = JSON.parse(redis_result);

        if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
            return redis_result;
        } else {
            const _query = {
                text: selectUserQuery,
                values: [username]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            authService.setUserInRedisByUserNameForLogin(username, queryResult);
            return queryResult;
        }
    },
    resetPassword: async (newPassword: string, mobileNumber : number): Promise<IUser[]> => {
            const _query = {
                text: resetPasswordQuery,
                values: [newPassword,mobileNumber]
            };
            const result = await pg.executeQueryPromise(_query);
            return result;
    },
    login: async (user: any): Promise<IUser[]> => {
        try {
            let redis_result = await authService.getUserInRedisByUserName(user.username);
            redis_result = redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;
    
            if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
                return redis_result
            }
    
            const _query = {
                text: selectUserQuery,
                values: [user.username]
            };
    
            const userResponse = await pg.executeQueryPromise(_query);
            if (!userResponse[0]) {
                return (`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);
            }

            const userId = userResponse[0].user_id;

            const userRoleModuleData = await authService.getRoleModuleList(userResponse[0].role_id)
            const userData = userResponse[0];
            const type = 1;

            user.password = decryptPayload(user.password);
            if (user.password == SERVICES.default_pass) {
                return (`{"errorCode":"USRAUT0007", "error":"${ERRORCODE.USRAUT0007}", "userId": "${userId}"}`);
            }

            const validPassword = await bcrypt.compare(user.password, userData.password);
            const policy = await passwordPolicy.validate_password(userId, user.password, type);

            if (validPassword && policy.status == true) {
                const token = await generateToken.generate(userData.user_name, userData, userRoleModuleData, req)
                return token.encoded;
                return;
            }

            const [invalidAttemptsData] = await authService.getInvalidLoginAttempts(user.user_name);
            const invalidAttempts = invalidAttemptsData.invalid_attempts;
            const [maxInvalidAttemptsData] = await authService.getMaxInvalidLoginAttempts();
            const maxInvalidAttempts = maxInvalidAttemptsData.max_invalid_attempts;

            if (maxInvalidAttempts > invalidAttempts) {
                await authService.incrementInvalidLoginAttempts(user.user_name);
            } else {
                await authService.setUserInactive(user.user_name);
                return (`{"errorCode":"USRAUT0005", "error":"${ERRORCODE.USRAUT0005}"}`);
            }
        } catch (error) {
            logger.error(`rolesService :: listRoles :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    getForgetPasswordOtp: async (mobile_number: number): Promise<IUser[]> => {
    {
        let redis_result = await authService.getUserInRedisByUserName(mobile_number);
            redis_result = redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;
    
            if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
                return redis_result
            }
    
            const _query = {
                text: selectUserQuery,
                values: [mobile_number]
            };
            const phoneNumberExists = await pg.executeQueryPromise(_query);
            if (!phoneNumberExists[0]) {
                const txnId = uuidv4()
                return (txnId);
            }
      
            let key = `Admin_Forgot_Password|User:${mobile_number}`;
            let redisResult = await redis.GetRedis(key);
      
            if (redisResult[0]) {
                var userData = JSON.parse(redisResult);
                const resp = {
                    "errorCode": "USRAUT0011",
                    "error": "OTP Already Sent!",
                    "txnId": userData.txnId
                };
                return (resp);
            } else {
                let new_txn_id = uuidv4();
                let otp = Math.floor(100000 + Math.random() * 900000);
      
                let userdata = {}
                userdata.user_name = mobile_number;
                userdata.txnId = new_txn_id;
                userdata.otp = otp;
                userdata.mobile_no = mobile_number;
      
                authService.setForgotPasswordOTPInRedis(userdata);
                await authService.shareForgotOTPUserDetails(userdata);
                return ({"txnId": new_txn_id})
            }
        }
    },
    verifyForgetPasswordOtp: async (txnId: string, otp: number): Promise<IUser[]> => {
        let key = `Admin_Forgot_Password|txnId:${txnId}`;
        let redisResult = await redis.GetRedis(key);
    
        if (redisResult) {
            let UserData = JSON.parse(redisResult);
            if (UserData.otp != parseInt(otp) || UserData.txnId !== txnId.toString()) {
                return (`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
            } else {
                let user_name = UserData.user_name;
                const checkUserData = await authService.checkUser(user_name);
                if (checkUserData[0]) {
                    let new_txnId = uuidv4();
                    let mobile_key = `Admin_Forgot_Password|User:${user_name}`;
                    let forgotPasswordChangeKey = `FORGOT_PASSWORD_CHANGE_${new_txnId}`;
                    await redis.deleteKey(mobile_key);
                    await redis.deleteKey(key);
                    redis.SetRedis(forgotPasswordChangeKey, { user_name }, 180);
                    return ({ message: 'OTP Verified Successfully', txnId: new_txnId });
                } else {
                    return (`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
                }
            }
        } else {
            return (`{ "errorCode": "USRAUT0014", "error": "${ERRORCODE.USRAUT0014}" }`);
        }
    },
    resetForgetPassword: async (reqData: any): Promise<IUser[]> => {
    let newPassword = decryptPayload(reqData.newPassword);
            let confirmNewPassword = decryptPayload(reqData.confirmNewPassword);
            const { txnId } = reqData;

            if (!txnId) {
                return (`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.USRPRF00027}"}`);
            }

            if (newPassword !== confirmNewPassword) {
                return ({  "error": "Passwords do not match" });
            }

            if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(newPassword)) {
                return ({ "error": "Password must be at least 8 characters long and contain at least one letter and one digit" });
            }

            const redisResult = await redis.GetRedis(`FORGOT_PASSWORD_CHANGE_${txnId}`);

            if (!redisResult) {
                return ({  "error": "Invalid forgot password request" });
            }

            let userData;
            try {
                userData = JSON.parse(redisResult);
            } catch (error) {
                return ({ "error": "Invalid Forgot Password Request" });
            }

            if (!userData || !userData.user_name) {
                return ({ "error": "Mobile number not found" });
            }

            const mobileNumber = userData.user_name;

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const passwordUpdated = await authService.resetPassword(hashedPassword, mobileNumber);

            if (passwordUpdated) {
                await redis.deleteKey(`FORGOT_PASSWORD_CHANGE_${txnId}`);
                await redis.deleteKey(`Admin_Forgot_Password|User:${mobileNumber}`);
                await redis.deleteKey(`User|Username:${mobileNumber}`);
                await redis.deleteKey(mobileNumber);
                return ({ message: 'Password updated successfully' });
            } else {
                return ({ "error": 'Password Reset Timeout'});
            }
        }

}