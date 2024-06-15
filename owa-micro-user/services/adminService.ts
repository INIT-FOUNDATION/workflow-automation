import { pg, logger, redis, objectStorageUtility, envUtils } from "owa-micro-common";
import { IUser } from "../types/custom";
import { USERS } from "../constants/QUERY";
import { CACHE_TTL } from "../constants/CONST";

export const adminService = {
    getLoggedInUserInfo: async (userName: string): Promise<IUser> => {
        try {
            const key = `LOGGED_IN_USER_INFO|USER:${userName}`;
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            }

            const _query = {
                text: USERS.getLoggedInUserInfo,
                values: [userName]
            };
            logger.debug(`adminService :: getLoggedInUserInfo :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: getLoggedInUserInfo :: db result :: ${JSON.stringify(result)}`)

            if (result.length > 0) {
                if (result[0].profile_pic_url) result[0].profile_pic_url = await adminService.generatePublicURLFromObjectStoragePrivateURL(result[0].profile_pic_url, 3600);
                redis.SetRedis(key, result[0], CACHE_TTL.LONG)
                return result[0]
            }
        } catch (error) {
            logger.error(`adminService :: getLoggedInUserInfo :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    generatePublicURLFromObjectStoragePrivateURL: async (locationPath: string, expiresIn: number = 3600): Promise<string> => {
        try {
            const bucketName = envUtils.getStringEnvVariableOrDefault("OWA_OBJECT_STORAGE_BUCKET", "owa-dev");
            const temporaryPublicURL = await objectStorageUtility.presignedGetObject(bucketName, locationPath, expiresIn);
            return temporaryPublicURL;
        } catch (error) {
            logger.error(`adminService :: generatePublicURLFromObjectStoragePrivateURL :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
}