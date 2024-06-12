import { CACHE_TTL } from "../constants/CONST";
import { redis, logger, pg } from "owa-micro-common";
import { user } from "../constants/config";
import { 
    selectUserQuery,
    getInvalidAttempts,
    setUserInactive,
    incrementInvalidAttempts,
    selectRoleDetailsQueryByRoleId,
    updateUserLoggedInOut,
    resetPasswordQuery
 } from "../constants/QUERY";

const getUserInRedisByUserName = async (username : string) => {
    let key = `User|Username:${username}`
    let result = await redis.GetKeyRedis(key);
    return result;

}

const setUserInRedisByUserNameForLogin = async (username : string, userObj: any) => {
    if (userObj && userObj[0]) {
        redis.SetRedis(`User|Username:${username}`, userObj, user.REDIS_EXPIRE_TIME_PWD)
            .then()
            .catch(err => logger.error(err));
    }
};


const selectUser = async (username: string) => {

    try {
        let redis_result = await getUserInRedisByUserName(username);
        redis_result = redis_result && typeof redis_result == 'string' ? JSON.parse(redis_result) : redis_result;

        if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
            return redis_result
        }

        const _query = {
            text: selectUserQuery,
            values: [username]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        await setUserInRedisByUserNameForLogin(username, queryResult).catch(e => logger.error(e));
        return queryResult

    } catch (error) {
        throw new Error(error.message)
    }

};

const checkUser = async (username: string) => {

    try {
        let redis_result = await getUserInRedisByUserName(username);

        redis_result = JSON.parse(redis_result);

        if (redis_result && redis_result.length && redis_result[0].account_locked != 1) {
            return redis_result;
        } else {
            const _query = {
                text: selectUserQuery,
                values: [username]
            };
            const queryResult = await pg.executeQueryPromise(_query);
            setUserInRedisByUserNameForLogin(username, queryResult);
            return queryResult;
        }
    } catch (err) {
        throw err;
    }
};

const shareForgotOTPUserDetails = async (userDetails) => {
    try {

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

    } catch (error) {
        throw error;
    }
}

const setForgotPasswordOTPInRedis = async (userData) => {
    if (userData != undefined && userData != null) {
        let txnId = userData.txnId;

        redis.SetRedis(`Admin_Forgot_Password|User:${userData.user_name}`, userData, 180)
            .then()
            .catch(err => logger.error(err));

        redis.SetRedis(`Admin_Forgot_Password|txnId:${txnId}`, userData, 180)
            .then()
            .catch(err => logger.error(err));
    };
};

const getRoleModuleList = async (role_id: string) => {
    try {
        const _query = {
            text: selectRoleDetailsQueryByRoleId,
            values: [role_id]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult[0];

    } catch (error) {
        throw new Error(error.message)
    }
};

const getInvalidLoginAttempts = async (user_name: string) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: getInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });

    });
}

const getMaxInvalidLoginAttempts = async () => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: getMaxInvalidLoginAttempts,
            values: []
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });

    });
}

const incrementInvalidLoginAttempts = (user_name: string) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: incrementInvalidAttempts,
            values: [user_name]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                logger.info('increment')
                logger.info(res);
                resolve(res);
            }
        });

    });
}

const setUserInactive = async (id: string) => {
    return new Promise(async (resolve, reject) => {

        const _query = {
            text: setUserInactive,
            values: [id]
        };

        await pg.executeQuery(_query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0]);
            }
        });

    });
}

const updateUserLoggedInOut = async (isLoggedIn : number, userName : string) => {

    try {

        const _query = {
            text: updateUserLoggedInOut,
            values: [isLoggedIn, userName]
        };

        const queryResult = await pg.executeQueryPromise(_query);
        return queryResult;

    } catch (error) {
        throw new Error(error.message);
    }
};

const resetPassword = async (newPassword : string, mobileNumber : number) => {
    try {
        const _query = {
            text: resetPasswordQuery,
            values: [newPassword,mobileNumber]
        };
        const result = await pg.executeQueryPromise(_query);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

export {
    selectUser,
    checkUser,
    setForgotPasswordOTPInRedis,
    shareForgotOTPUserDetails,
    getRoleModuleList,
    getInvalidLoginAttempts,
    getMaxInvalidLoginAttempts,
    incrementInvalidLoginAttempts,
    setUserInactive,
    updateUserLoggedInOut,
    resetPassword
};
