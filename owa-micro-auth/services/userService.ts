import { IUser } from "../types/custom";
import { redis, logger, pg, nodemailerUtils, ejsUtils } from "owa-micro-common";
import { USERS } from "../constants/QUERY";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
import { CONFIG } from "../constants/CONST";
import { CACHE_TTL } from "../constants/CONST";

export const userService = {
    getUserInRedisByUserName: async (username: string): Promise<string> => {
        try {
            let key = `EmployeeUser|Username:${username}`
            let result = await redis.GetKeyRedis(key);
            return result;
        } catch (error) {
            logger.error(`userService :: getUserInRedisByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUserByUserName: async (userName: string): Promise<IUser> => {
        try {
            const cachedResult = await userService.getUserInRedisByUserName(userName);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            } else {
                const _query = {
                    text: USERS.getUserByUsername,
                    values: [userName]
                };
                logger.debug(`userService :: getUserByUserName :: query :: ${JSON.stringify(_query)}`);

                const result = await pg.executeQueryPromise(_query);
                logger.debug(`userService :: getUserByUserName :: db result :: ${JSON.stringify(result)}`);

                if (result && result.length > 0) {
                    redis.SetRedis(`EmployeeUser|Username:${userName}`, result[0], CONFIG.REDIS_EXPIRE_TIME_PWD);
                    return result[0];
                };
            }
        } catch (error) {
            logger.error(`userService :: getUserByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string) => {
        try {
            const _query = {
                text: USERS.updateUserLoggedInStatus,
                values: [userName, loginStatus]
            };
            logger.debug(`userService :: updateUserLoginStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: updateUserLoginStatus :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`EmployeeUser|Username:${userName}`);
        } catch (error) {
            logger.error(`userService :: updateUserLoginStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<number> => {
        try {
            const _query = {
                text: USERS.getInvalidAttempts,
                values: [user_name]
            };
            logger.debug(`userService :: getInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: getInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].invalid_attempts;
        } catch (error) {
            logger.error(`userService :: getInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getMaxInvalidLoginAttempts: async (): Promise<number> => {
        try {
            const _query = {
                text: USERS.getMaxInvalidLoginAttempts
            };
            logger.debug(`userService :: getMaxInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: getMaxInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].maximum_invalid_attempts;
        } catch (error) {
            logger.error(`userService :: getMaxInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    incrementInvalidLoginAttempts: async (userName: string) => {
        try {
            const _query = {
                text: USERS.incrementInvalidAttempts,
                values: [userName]
            };
            logger.debug(`userService :: incrementInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: incrementInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`userService :: incrementInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        try {
            const _query = {
                text: USERS.setUserInActive,
                values: [userName]
            };
            logger.debug(`userService :: setUserInActive :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`userService :: setUserInActive :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
            redis.deleteRedis(`USERS_COUNT`);
        } catch (error) {
            logger.error(`userService :: setUserInActive :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInRedisByTxnId : async (userData) => {
        if (userData != undefined && userData != null) {
            let txnId = userData.txnId;
            redis.SetRedis(`User|txnId:${txnId}`, userData, 180)
                .then()
                .catch(err => logger.error(err));
        };
    },
    setUserInRedisForReg : async (phoneNo, userData, result) => {
        if (userData != undefined && userData != null) {
            try {
                let redisKey = `Reg_Mob_${phoneNo}`
                await userService.setOTPInRedis(redisKey, userData);
                return result(null, 'done');
            } catch (e) {
                return result(e, null);
            }
        };
    },
    setOTPInRedis : async (redisKey, userData) => {
        let res = await userService.checkIfOtpExistInRedis(redisKey);
        if (res) {
            throw new Error('OTP ALREADY SENT')
        } else {
            redis.SetRedis(redisKey, userData, 180)
                .then()
                .catch(err => logger.error(err));
            return;
        }
    },
    checkIfOtpExistInRedis : async (key) => {
        let res = await redis.GetKeyRedis(key);
        return res;
    }
}