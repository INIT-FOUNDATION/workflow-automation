import { logger, STATUS } from "owa-micro-common";
import { rolesService } from "../services/rolesService";
import { Response } from "express";
import { Request } from "../types/express";
import { validateCreateRole, validateUpdateRole, Role, validateUpdateRoleStatus } from "../models/rolesModel";
import { IRole } from "../types/custom";
import { ROLES } from "../constants/ERRORCODE";

export const usersController = {
    createUser: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roles = await rolesService.listRoles();
            return res.status(STATUS.OK).send({
                data: roles,
                message: "Roles Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: listRoles :: ${error.message} :: ${error}`)
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
            
            role.created_by = plainToken.user_id;
            role.updated_by = plainToken.user_id;

            await rolesService.addRole(role);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Added Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: addRole :: ${error.message} :: ${error}`)
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
            
            role.updated_by = plainToken.user_id;

            await rolesService.updateRole(role);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Added Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: addRole :: ${error.message} :: ${error}`)
        }
    },
    getRoleById: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003)
            
            const role = await rolesService.getRoleById(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: role,
                message: "Role Added Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getRoleById :: ${error.message} :: ${error}`)
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
            
            await rolesService.updateRoleStatus(role.role_id, role.status, plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Role Status Updated Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: updateRoleStatus :: ${error.message} :: ${error}`)
        }
    },
    getAccessListByRoleId: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);

            const accessList = await rolesService.getAccessListByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: accessList,
                message: "Access List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getAccessListByRoleId :: ${error.message} :: ${error}`)
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
            logger.error(`rolesController :: getMenusListByRoleId :: ${error.message} :: ${error}`)
        }
    },
    getCombinedAccessListByRoleId: async(req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            const userId = req.params.userId;

            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00003);
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00005);

            const combinedAccessList = await rolesService.getCombinedAccessListByRoleId(parseInt(roleId), parseInt(userId));

            return res.status(STATUS.OK).send({
                data: combinedAccessList,
                message: "Combined Access List Fetched Successfully",
              });
        } catch (error) {
            logger.error(`rolesController :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`)
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
            logger.error(`rolesController :: getCombinedAccessListByRoleId :: ${error.message} :: ${error}`)
        }
    },
}