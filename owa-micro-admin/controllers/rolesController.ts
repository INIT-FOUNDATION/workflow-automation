import { logger, STATUS } from "owa-micro-common";
import { rolesService } from "../services/rolesService";
import { Response } from "express";
import { Request } from "../types/express";
import { validateCreateRole, validateUpdateRole, Role, validateUpdateRoleStatus } from "../models/rolesModel";
import { IRole } from "../types/custom";
import { ROLES } from "../constants/ERRORCODE";
import { usersService } from "../services/usersService";

export const rolesController = {
    listRoles: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roles = await rolesService.listRoles();
            return res.status(STATUS.OK).send({
                data: roles,
                message: "Roles Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: listRoles :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    addRole: async(req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const role: IRole = new Role(req.body)
            const { error } = validateCreateRole(role);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 
            
            const roleExistsByName = await rolesService.existsByRoleName(role.role_name, null);
            if (roleExistsByName) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00007);

            role.created_by = plainToken.user_id;
            role.updated_by = plainToken.user_id;

            await rolesService.addRole(role);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Added Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: addRole :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    updateRole: async(req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const role: IRole = req.body
            const { error } = validateUpdateRole(role);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 

            const roleExistsById = await rolesService.existsByRoleId(role.role_id);
            if (!roleExistsById) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const roleExistsByName = await rolesService.existsByRoleName(role.role_name, role.role_id);
            if (roleExistsByName) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00007);
            
            role.updated_by = plainToken.user_id;

            await rolesService.updateRole(role);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Updated Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: updateRole :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    getRoleById: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003)
            
            const roleExists = await rolesService.existsByRoleId(parseInt(roleId));
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);
            
            const role = await rolesService.getRoleById(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: role,
                message: "Role Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getRoleById :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    updateRoleStatus: async(req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const role: IRole = req.body
            const { error } = validateUpdateRoleStatus(role);

            if (error) {
              if (error.details != null)
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
              else return res.status(STATUS.BAD_REQUEST).send(error.message);
            } 

            const roleExists = await rolesService.existsByRoleId(role.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);
            
            await rolesService.updateRoleStatus(role.role_id, role.status, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Status Updated Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: updateRoleStatus :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    getAccessListByRoleId: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);

            const roleExists = await rolesService.existsByRoleId(parseInt(roleId));
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const accessList = await rolesService.getAccessListByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: accessList,
                message: "Access List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getAccessListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    getMenusListByRoleId: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);

            const menusList = await rolesService.getMenusListByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: menusList,
                message: "Menus List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getMenusListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    getCombinedAccessListByRoleId: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            const userId = req.params.userId;

            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00005);

            const roleExists = await rolesService.existsByRoleId(parseInt(roleId));
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);
            
            const userExists = await usersService.existsByUserId(parseInt(userId));
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00008);
            
            const combinedAccessList = await rolesService.getCombinedAccessListByRoleId(parseInt(roleId), parseInt(userId));
            
            return res.status(STATUS.OK).send({
                data: combinedAccessList,
                message: "Combined Access List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
    getDefaultAccessList: async(req: Request, res: Response): Promise<Response> => {
        try {
            const defaultAccessList = await rolesService.getDefaultAccessList();
            return res.status(STATUS.OK).send({
                data: defaultAccessList,
                message: "Default Access List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.OK).send(ROLES.ROLE00000);
        }
    },
}