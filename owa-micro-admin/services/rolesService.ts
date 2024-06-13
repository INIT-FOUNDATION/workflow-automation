import { pg, logger, redis } from "owa-micro-common";
import { ROLES } from "../constants/QUERY";
import { IRole } from "../types/custom";
import { CACHE_TTL } from "../constants/CONST";

export const rolesService = {
  listRoles: async (): Promise<IRole[]> => {
    try {
      const key = `ROLES`;
      const cachedResult = await redis.GetKeyRedis(key);

      if (cachedResult) {
        logger.debug(`rolesService :: listRoles :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.listRoles
      };
      logger.debug(`rolesService :: listRoles :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: listRoles :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result, CACHE_TTL.LONG);
      return result;
    } catch (error) {
      logger.error(`rolesService :: listRoles :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  addRole: async (role: IRole) => {
    try {
      const _query = {
        text: ROLES.addRole,
        values: [role.role_name, role.role_description, role.created_by, role.updated_by]
      };
      logger.debug(`rolesService :: addRole :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: addRole :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`ROLES`);
    } catch (error) {
      logger.error(`rolesService :: addRole :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRole: async (role: IRole) => {
    try {
      const _query = {
        text: ROLES.updateRole,
        values: [role.role_id, role.role_name, role.role_description, role.updated_by]
      };
      logger.debug(`rolesService :: updateRole :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: updateRole :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`ROLE:${role.role_id}`);
      redis.deleteRedis(`ROLES`);
    } catch (error) {
      logger.error(`rolesService :: updateRole :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getRoleById: async (roleId: number): Promise<IRole> => {
    try {
      const key = `ROLE:${roleId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: getRoleById :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.getRole,
        values: [roleId]
      };
      logger.debug(`rolesService :: getRoleById :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getRoleById :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result[0], CACHE_TTL.LONG);
      return result && result.length > 0 ? result[0] : [];
    } catch (error) {
      logger.error(`rolesService :: getRoleById :: roleId :: ${roleId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRoleStatus: async (roleId: number, status: number, updatedBy: number) => {
    try {
      const _query = {
        text: ROLES.updateRoleStatus,
        values: [roleId, status, updatedBy]
      };
      logger.debug(`rolesService :: updateRoleStatus :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: updateRoleStatus :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`ROLE:${roleId}`);
      redis.deleteRedis(`ROLES`);
    } catch (error) {
      logger.error(`rolesService :: updateRoleStatus :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getAccessListByRoleId: async (roleId: number): Promise<any> => {
    try {
      const key = `ACCESS_LIST|ROLE:${roleId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: getAccessListByRoleId :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.getAccessListByRoleId,
        values: [roleId]
      };
      logger.debug(`rolesService :: getAccessListByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getAccessListByRoleId :: db result :: ${JSON.stringify(result)}`)

      redis.SetRedis(key, result, CACHE_TTL.LONG);
    } catch (error) {
      logger.error(`rolesService :: getAccessListByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getMenusListByRoleId: async (roleId: number): Promise<any> => {
    try {
      const _query = {
        text: ROLES.getMenusListByRoleId,
        values: [roleId]
      };
      logger.debug(`rolesService :: getMenusListByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getMenusListByRoleId :: db result :: ${JSON.stringify(result)}`)
    } catch (error) {
      logger.error(`rolesService :: getMenusListByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getCombinedAccessListByRoleId: async (roleId: number, userId: number): Promise<any> => {
    try {
      const key = `COMBINED_ACCESS_LIST|USER:${userId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: getCombinedAccessListByRoleId :: roleId :: ${roleId} :: userId :: ${userId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.getCombinedAccessListByRoleId,
        values: [roleId, userId]
      };
      logger.debug(`rolesService :: getCombinedAccessListByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getCombinedAccessListByRoleId :: db result :: ${JSON.stringify(result)}`)

      redis.SetRedis(key, result, CACHE_TTL.LONG);
    } catch (error) {
      logger.error(`rolesService :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getDefaultAccessList: async (): Promise<any> => {
    try {
      const _query = {
        text: ROLES.getDefaultAccessList
      };
      logger.debug(`rolesService :: getDefaultAccessList :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getDefaultAccessList :: db result :: ${JSON.stringify(result)}`)

    } catch (error) {
      logger.error(`rolesService :: getDefaultAccessList :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByRoleId: async (roleId: number): Promise<boolean> => {
    try {
      const _query = {
        text: ROLES.existsByRoleId,
        values: [roleId]
      };
      logger.debug(`rolesService :: existsByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: existsByRoleId :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`rolesService :: existsByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByRoleName: async (roleName: string, roleId: number | undefined): Promise<boolean> => {
    try {
      const _query = {
        text: ROLES.existsByRoleName,
        values: [roleName]
      };
      if (roleId) _query.text = _query.text.replace(`status = 1`, `status = 1 AND role_id <> ${roleId}`);
      logger.debug(`rolesService :: existsByRoleName :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: existsByRoleName :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`rolesService :: existsByRoleName :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
}