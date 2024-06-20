import { pg, logger, redis, JSONUTIL, objectStorageUtility, envUtils, ejsUtils, nodemailerUtils } from "owa-micro-common";
import { USERS, USER_DEPARTMENT_MAPPING, USER_REPORTING_MAPPING } from "../constants/QUERY";
import { IPasswordPolicy, IUser } from "../types/custom";
import { CACHE_TTL, DEFAULT_PASSWORD } from "../constants/CONST";
import { passwordPoliciesService } from "./passwordPoliciesService";
import bcrypt from "bcryptjs";
import RandExp from "randexp";
import { UploadedFile } from "express-fileupload";

export const usersService = {
  usersUpdatedWithinFiveMints: async() : Promise<boolean> => {
    try {
        logger.info("usersService :: Inside usersUpdatedWithinFiveMints");

        const _queryToCheckLatestUpdated = {
            text: USERS.latestUpdatedCheck
        };

        logger.debug(`usersService :: latestUpdated :: query :: ${JSON.stringify(_queryToCheckLatestUpdated)}`)
        const latestUpdatedInForm = await pg.executeQueryPromise(_queryToCheckLatestUpdated);
        const isUserUpdatedWithin5mins = (latestUpdatedInForm[0].count > 0);
        logger.info(`usersService :: latestUpdated :: result :: ${JSON.stringify(latestUpdatedInForm)} :: isUserUpdatedWithin5mins :: ${isUserUpdatedWithin5mins}`);

        return isUserUpdatedWithin5mins;
    } catch (error) {
        logger.error(`usersService :: usersUpdatedWithinFiveMints :: ${error.message} :: ${error}`)
        throw new Error(error.message);
    }
  },
  listUsers: async (userId: number, pageSize: number, currentPage: number, searchQuery: string): Promise<IUser[]> => {
    try {
      let key = `USERS|USER:${userId}`;
      const _query = {
        text: USERS.usersList
      };

      if (userId != 1) _query.text += ` AND ${userId} = ANY(reporting_to_users)`;

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
          _query.text += ` AND mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` AND display_name ILIKE '%${searchQuery}%'`;
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

      const isUserUpdatedWithin5min = await usersService.usersUpdatedWithinFiveMints();

      if (!isUserUpdatedWithin5min) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(`usersService :: listUsers :: cached result :: ${cachedResult}`)
          return JSON.parse(cachedResult)
        }
      }

      logger.debug(`usersService :: listUsers :: query :: ${JSON.stringify(_query)}`);

      const usersResult: IUser[] = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsers :: db result :: ${JSON.stringify(usersResult)}`);

      for (const user of usersResult) {
        if (user.profile_pic_url) user.profile_pic_url = await usersService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
      }

      if (usersResult && usersResult.length > 0) redis.SetRedis(key, usersResult, CACHE_TTL.LONG);
      return usersResult;
    } catch (error) {
      logger.error(`usersService :: listUsers :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  listUsersCount: async (userId: number, searchQuery: string): Promise<number> => {
    try {
      let key = `USERS_COUNT|${userId}`;
      const _query = {
        text: USERS.usersListCount
      };

      if (userId != 1) _query.text += ` AND ${userId} = ANY(reporting_to_users)`;

      if (searchQuery) {
        const isSearchStringAMobileNumber = /^\d{10}$/.test(searchQuery);
        if (isSearchStringAMobileNumber) {
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
          _query.text += ` mobile_number = ${searchQuery}`;
        } else {
          _query.text += ` display_name ILIKE '%${searchQuery}%'`;
          key += `|SEARCH:${isSearchStringAMobileNumber}`;
        }
      }

      const isUserUpdatedWithin5min = await usersService.usersUpdatedWithinFiveMints();

      if (!isUserUpdatedWithin5min) {
        const cachedResult = await redis.GetKeyRedis(key);
        if (cachedResult) {
          logger.debug(`usersService :: listUsersCount :: cached result :: ${cachedResult}`)
          return JSON.parse(cachedResult)
        }
      }

      logger.debug(`usersService :: listUsersCount :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: listUsersCount :: db result :: ${JSON.stringify(result)}`)

      if (result.length > 0) {
        const count = parseInt(result[0].count);
        if (count > 0) redis.SetRedis(key, count, CACHE_TTL.LONG);
        return count
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

      const { encryptedPassword, plainPassword } = await usersService.generatePasswordFromPasswordPolicy(passwordPolicy);
      user.password = encryptedPassword;
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

      if (user.reporting_to_users && user.reporting_to_users.length > 0) {
        await usersService.createUserReportingMapping(createdUserId, user.reporting_to_users);
      }

      await usersService.sharePasswordToUser({
        emailId: user.email_id,
        password: plainPassword,
        displayName: user.display_name
      });

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
      redis.deleteRedis(`USERS_COUNT`);
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
      
      if (user.reporting_to_users && user.reporting_to_users.length > 0) {
        await usersService.updateUserReportingMapping(user.user_id, user.reporting_to_users);
      }

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
      redis.deleteRedis(`USERS_COUNT`);
      redis.deleteRedis(`USER:${user.user_id}`);
      redis.deleteRedis(`User|Username:${user.user_name}`);
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
  generatePasswordFromPasswordPolicy: async (passwordPolicy: IPasswordPolicy): Promise<any> => {
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
      const encryptedPassword = await bcrypt.hash(randomExpression, salt);
      return { encryptedPassword, plainPassword: randomExpression };
    } catch (error) {
      logger.error(`usersService :: generatePasswordFromPasswordPolicy :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  createUserDepartmentMapping: async (userId: number, departmentId: number) => {
    try {
      const _query = {
        text: USER_DEPARTMENT_MAPPING.createUserDepartmentMapping,
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
        text: USER_DEPARTMENT_MAPPING.updateUserUpdateMapping,
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
      redis.deleteRedis(`USERS_COUNT`);
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
  },
  sharePasswordToUser: async (passwordDetails: any) => {
    try {
      if (passwordDetails.emailId) {
        const emailTemplateHtml = await ejsUtils.generateHtml('views/sharePasswordEmailTemplate.ejs', passwordDetails);
        await nodemailerUtils.sendEmail('OLL WORKFLOW AUTOMATION | LOGIN DETAILS', emailTemplateHtml, passwordDetails.emailId);
      }
    } catch (error) {
      logger.error(`adminService :: sharePasswordToUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  createUserReportingMapping: async (userId: number, reportingToUsers: number[]) => {
    try {
      for (const reportingToUser of reportingToUsers) {
        const _query = {
          text: USER_REPORTING_MAPPING.createUserReportingMapping,
          values: [userId, reportingToUser]
        };
        logger.debug(`usersService :: createUserReportingMapping :: query :: ${JSON.stringify(_query)}`);

        const result = await pg.executeQueryPromise(_query);
        logger.debug(`usersService :: createUserReportingMapping :: db result :: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      logger.error(`usersService :: createUserReportingMapping :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateUserReportingMapping: async (userId: number, reportingToUsers: number[]) => {
    try {
      const _query = {
        text: USER_REPORTING_MAPPING.updateInActiveReportingMapping,
        values: [userId]
      };
      logger.debug(`usersService :: updateUserDepartmentMapping :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: updateUserDepartmentMapping :: db result :: ${JSON.stringify(result)}`);

      await usersService.createUserReportingMapping(userId, reportingToUsers);
    } catch (error) {
      logger.error(`usersService :: updateUserDepartmentMapping :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getReportingUsersList: async (levels: string[], user_id: number): Promise<{user_id: number, display_name: string}[]> => {
    try {
      const placeholders = levels.map((_, i) => `$${i + 1}`).join(', ');
      let query = `${USERS.getReportingUsersList} IN (${placeholders}) AND VU.role_id <> 1`;

      if (user_id) {
        query += ` AND VU.user_id <> ${user_id}`
      }

      const _query = {
        text: query,
        values: levels
      };
      logger.debug(`usersService :: getReportingUsersList :: query :: ${JSON.stringify(_query)}`);

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: getReportingUsersList :: db result :: ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      logger.error(`usersService :: getReportingUsersList :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  deleteUser: async (user: IUser) => {
    try {
      const _query = {
        text: USERS.deleteUser,
        values: [user.user_id]
      };
      logger.debug(`usersService :: deleteUser :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`usersService :: deleteUser :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`USERS|OFFSET:0|LIMIT:50`);
      redis.deleteRedis(`USERS_COUNT`);
      redis.deleteRedis(`USER:${user.user_id}`);
      redis.deleteRedis(`User|Username:${user.user_name}`);
    } catch (error) {
      logger.error(`usersService :: deleteUser :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  }
}
