import { pg, logger, redis, JSONUTIL, objectStorageUtility, envUtils } from "owa-micro-common";
import { USERS, USER_DEPARTMENT_MAPPING } from "../constants/QUERY";
import { IPasswordPolicy, IUser } from "../types/custom";
import { CACHE_TTL, DEFAULT_PASSWORD } from "../constants/CONST";
import { PlainToken } from "../types/express";
import { passwordPoliciesService } from "./passwordPoliciesService";
import bcrypt from "bcryptjs";
import RandExp from "randexp";
import { UploadedFile } from "express-fileupload";

export const usersService = {
  listUsers: async (plainToken: PlainToken, pageSize: number, currentPage: number, searchQuery: string): Promise<IUser[]> => {
    try {
      let key = `USERS`;
      const _query = {
        text: USERS.usersList
      };

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
          _query.text += ` AND mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE %${searchQuery}%`;
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
        }
      }

      if (pageSize) {
        key += `|LIMIT:${pageSize}`;
        _query.text += ` LIMIT ${pageSize}`;
      }

      if (currentPage) {
        key += `|OFFSET:${currentPage}`;
        _query.text += ` OFFSET ${currentPage}`;
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: listUsers :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      logger.debug(`usersService :: listUsers :: query :: ${JSON.stringify(_query)}`);

      const usersResult: IUser[] = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsers :: db result :: ${JSON.stringify(usersResult)}`);

      for (const user of usersResult) {
        user.profile_pic_url = await usersService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
      }

      if (usersResult && usersResult.length > 0) redis.SetRedis(key, usersResult, CACHE_TTL.LONG);
      return usersResult;
    } catch (error) {
      logger.error(`usersService :: listUsers :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  listUsersCount: async (plainToken: PlainToken, searchQuery: string): Promise<number> => {
    try {
      let key = `USERS_COUNT`;
      const _query = {
        text: USERS.usersListCount
      };

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
          _query.text += ` mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` display_name ILIKE %${searchQuery}%`;
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
        }
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: listUsersCount :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      logger.debug(`usersService :: listUsersCount :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsersCount :: db result :: ${JSON.stringify(result)}`)

      if (result.length > 0) {
         redis.SetRedis(key, result, CACHE_TTL.LONG);
         return result[0].count
      };
    } catch (error) {
      logger.error(`usersService :: listUsersCount :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  createUser: async (user: IUser) => {
    try {
      const passwordPolicies = await passwordPoliciesService.listPasswordPolicies();
      const passwordPolicy = passwordPolicies[0];

      user.password = await usersService.generatePasswordFromPasswordPolicy(passwordPolicy);
      user.display_name = JSONUTIL.capitalize(user.display_name.trim());

      const _query = {
        text: USERS.createUser,
        values: [user.user_name,
        user.first_name,
        user.last_name,
        user.display_name,
        user.dob,
        user.gender,
        user.mobile_number,
        user.password,
        user.role_id,
        user.email_id,
        user.created_by,
        user.updated_by
        ]
      };
      logger.debug(`usersService :: createUser :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: createUser :: db result :: ${JSON.stringify(result)}`)

      const createdUserId = result[0].user_id;
      await usersService.createUserDepartmentMapping(createdUserId, user.department_id);

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
    } catch (error) {
      logger.error(`usersService :: createUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateUser: async (user: IUser) => {
    try {
      const _query = {
        text: USERS.updateUser,
        values: [user.user_id, user.first_name, user.last_name, user.display_name,
        user.dob, user.gender,
        user.email_id, user.updated_by, user.role_id
        ]
      };
      logger.debug(`usersService :: updateUser :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: updateUser :: db result :: ${JSON.stringify(result)}`)

      await usersService.updateUserDepartmentMapping(user.user_id, user.department_id);

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
      redis.deleteRedis(`USER:${user.user_id}`);
    } catch (error) {
      logger.error(`usersService :: updateUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getUserById: async (userId: number): Promise<IUser> => {
    try {
      const key = `USER:${userId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: getUserById :: userId :: ${userId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: USERS.getUser,
        values: [userId]
      };
      logger.debug(`usersService :: getUserById :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: getUserById :: db result :: ${JSON.stringify(result)}`)

      if (result.length > 0) {
        if (result[0].profile_pic_url) result[0].profile_pic_url = await usersService.generatePublicURLFromObjectStoragePrivateURL(result[0].profile_pic_url, 3600);
        redis.SetRedis(key, result[0], CACHE_TTL.LONG)
        return result[0]
      }
    } catch (error) {
      logger.error(`usersService :: getUserById :: userId :: ${userId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
    try {
      const _query = {
        text: USERS.existsByMobileNumber,
        values: [mobileNumber]
      };
      logger.debug(`usersService :: existsByMobileNumber :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: existsByMobileNumber :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`usersService :: existsByMobileNumber :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByUserId: async (userId: number): Promise<boolean> => {
    try {
      const _query = {
        text: USERS.existsByUserId,
        values: [userId]
      };
      logger.debug(`usersService :: existsByUserId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: existsByUserId :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`usersService :: existsByUserId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  generatePasswordFromPasswordPolicy: async (passwordPolicy: IPasswordPolicy): Promise<string> => {
    try {
      let pattern = "", tempStr = "";
      const alphabetical = /[A-Z][a-z]/;
      const numeric = /[0-9]/;
      const special = /[!@#$&*]/;

      const passwordLength = passwordPolicy.minimum_password_length;
      tempStr += (passwordPolicy.complexity && passwordPolicy.alphabetical) ? alphabetical.source : '';
      tempStr += numeric.source;

      if (passwordPolicy.complexity && passwordPolicy.numeric) {
        tempStr += numeric.source;
      }

      if (passwordPolicy.complexity && passwordPolicy.special_characters) {
        tempStr += special.source;
      }

      if (tempStr) {
        tempStr += `{${passwordLength}}`;
        pattern = tempStr;
      } else {
        pattern = '[1-9]{' + length + '}';
      }

      const regexPattern = new RegExp(pattern);
      const randomExpression = new RandExp(regexPattern).gen();
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(randomExpression, salt);
      return password;
    } catch (error) {
      logger.error(`usersService :: generatePasswordFromPasswordPolicy :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  createUserDepartmentMapping: async (userId: number, departmentId: number) => {
    try {
      const _query = {
        text: USER_DEPARTMENT_MAPPING.createUserMapping,
        values: [userId, departmentId]
      };
      logger.debug(`usersService :: createUserDepartmentMapping :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: createUserDepartmentMapping :: db result :: ${JSON.stringify(result)}`);

    } catch (error) {
      logger.error(`usersService :: createUserDepartmentMapping :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateUserDepartmentMapping: async (userId: number, departmentId: number) => {
    try {
      const _query = {
        text: USER_DEPARTMENT_MAPPING.updateUserMapping,
        values: [userId, departmentId]
      };
      logger.debug(`usersService :: updateUserDepartmentMapping :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: updateUserDepartmentMapping :: db result :: ${JSON.stringify(result)}`);

    } catch (error) {
      logger.error(`usersService :: updateUserDepartmentMapping :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateProfilePic: async (profilePicture: UploadedFile, userId: number) => {
    try {
      const objectStoragePath = `profile-pictures/PROFILE_PICTURE_${userId}.${profilePicture.mimetype.split("/")[1]}`;
      const bucketName = envUtils.getStringEnvVariableOrDefault("OWA_OBJECT_STORAGE_BUCKET", "owa-dev");
      await objectStorageUtility.putObject(bucketName, objectStoragePath, profilePicture.data);
      
      const _query = {
        text: USERS.updateProfilePic,
        values: [userId, objectStoragePath]
      };
      logger.debug(`usersService :: updateProfilePic :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: updateProfilePic :: db result :: ${JSON.stringify(result)}`);

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
      redis.deleteRedis(`USER:${userId}`);
    } catch (error) {
      logger.error(`usersService :: updateProfilePic :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getUsersByRoleId: async (roleId: number): Promise<IUser[]> => {
    try {
      const key = `USERS|ROLE:${roleId}`;
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`usersService :: getUsersByRoleId :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: USERS.getUsersByRoleId,
        values: [roleId]
      };
      logger.debug(`usersService :: getUsersByRoleId :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: getUsersByRoleId :: db result :: ${JSON.stringify(result)}`);

      if (result && result.length > 0) redis.SetRedis(key, result, CACHE_TTL.LONG);
      return result;
    } catch (error) {
      logger.error(`usersService :: getUsersByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  resetPasswordForUserId: async (userId: number) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(DEFAULT_PASSWORD, salt);

      const _query = {
        text: USERS.resetPasswordForUserId,
        values: [userId, password]
      };
      logger.debug(`usersService :: resetPasswordForUserId :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: resetPasswordForUserId :: db result :: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`usersService :: resetPasswordForUserId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  generatePublicURLFromObjectStoragePrivateURL: async (locationPath: string, expiresIn: number = 3600): Promise<string> => {
    try {
      const bucketName = envUtils.getStringEnvVariableOrDefault("OWA_OBJECT_STORAGE_BUCKET", "owa-dev");
      const temporaryPublicURL = await objectStorageUtility.presignedGetObject(bucketName, locationPath, expiresIn);
      return temporaryPublicURL;
    } catch (error) {
      logger.error(`usersService :: generatePublicURLFromObjectStoragePrivateURL :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  }
}