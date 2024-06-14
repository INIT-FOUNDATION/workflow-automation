import { logger, STATUS, envUtils } from "owa-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { GRID_DEFAULT_OPTIONS } from "../constants/CONST";
import { usersService } from "../services/usersService";
import { IUser } from "../types/custom";
import { User, validateCreateUser, validateUpdateUser } from "../models/usersModel";
import { departmentsService } from "../services/departmentsService";
import { DEPARTMENTS, ROLES, USERS } from "../constants/ERRORCODE";
import { rolesService } from "../services/rolesService";

export const usersController = {
    listUsers: async (req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const pageSize = req.body.page_size || GRID_DEFAULT_OPTIONS.PAGE_SIZE;
            let currentPage = req.body.current_page || GRID_DEFAULT_OPTIONS.CURRENT_PAGE;
            const searchQuery = req.body.searchQuery || "";

            if (currentPage > 1) {
                currentPage = (currentPage - 1) * pageSize;
            } else {
                currentPage = 0;
            }

            const usersList = await usersService.listUsers(plainToken, pageSize, currentPage, searchQuery);
            const usersCount = await usersService.listUsersCount(plainToken, searchQuery);

            return res.status(STATUS.OK).send({
                data: { usersList, usersCount },
                message: "Users Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: listUsers :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    createUser: async (req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const user: IUser = new User(req.body)
            const { error } = validateCreateUser(user);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.message });
            }

            const roleExists = await rolesService.existsByRoleId(user.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const departmentExists = await departmentsService.existsByDepartmentId(user.department_id);
            if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);

            const userExists = await usersService.existsByMobileNumber(user.mobile_number);
            if (userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00005);

            user.created_by = plainToken.user_id;
            user.updated_by = plainToken.user_id;

            await usersService.createUser(user);

            return res.status(STATUS.OK).send({
                data: null,
                message: "User Added Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: createUser :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    updateUser: async (req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;
            const user: IUser = req.body;

            const { error } = validateUpdateUser(user);

            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: USERS.USER00000.errorCode, errorMessage: error.message });
            }

            const roleExists = await rolesService.existsByRoleId(user.role_id);
            if (!roleExists) return res.status(STATUS.BAD_REQUEST).send(ROLES.ROLE00006);

            const departmentExists = await departmentsService.existsByDepartmentId(user.department_id);
            if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);

            const userExists = await usersService.existsByUserId(user.user_id);
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000011);

            user.updated_by = plainToken.user_id;

            await usersService.updateUser(user);

            return res.status(STATUS.OK).send({
                data: null,
                message: "User Updated Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: updateUser :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    getUserById: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.params.userId;
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00006)

            const user = await usersService.getUserById(parseInt(userId));

            return res.status(STATUS.OK).send({
                data: user,
                message: "User Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: getUserById :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    updateProfilePic: async (req: Request, res: Response): Promise<Response> => {
        try {
            const plainToken = req.plainToken;

            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(STATUS.BAD_REQUEST).send(USERS.USER00008);

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(req.files.file[0].mimetype)) {
                return res.status(STATUS.BAD_REQUEST).send(USERS.USER00009);
            }

            const uploadSizeLimit = envUtils.getNumberEnvVariableOrDefault("OWA_UPLOAD_FILE_SIZE_LIMIT", 5 * 1024 * 1024 )
            if (req.files.file[0].size > uploadSizeLimit) {
                return res.status(STATUS.BAD_REQUEST).send(USERS.USER00010);
            }

            const userExists = await usersService.existsByUserId(plainToken.user_id);
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00005);

            await usersService.updateProfilePic(req.files.file[0], plainToken.user_id);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Profile Picture Updated Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: updateProfilePic :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    listUsersByRoleId: async (req: Request, res: Response): Promise<Response> => {
        try {
            const roleId = req.params.roleId;
            if (!roleId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00007);

            const users = await usersService.getUsersByRoleId(parseInt(roleId));

            return res.status(STATUS.OK).send({
                data: users,
                message: "Users Fetched Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: listUsersByRoleId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
    resetPasswordForUserId: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userId = req.params.userId;
            if (!userId) return res.status(STATUS.BAD_REQUEST).send(USERS.USER00008);

            const userExists = await usersService.existsByUserId(parseInt(userId));
            if (!userExists) return res.status(STATUS.BAD_REQUEST).send(USERS.USER000011);

            await usersService.resetPasswordForUserId(parseInt(userId));

            return res.status(STATUS.OK).send({
                data: null,
                message: "Resetted Password Successfully",
            });
        } catch (error) {
            logger.error(`usersController :: resetPasswordForUserId :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(USERS.USER00000);
        }
    },
}