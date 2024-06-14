import { Response } from "express";
import { STATUS, logger } from "owa-micro-common";
import { ADMIN } from "../constants/ERRORCODE";
import { Request } from "../types/express";
import { adminService } from "../services/adminService";

export const adminController = {
    getLoggedInUserInfo: async (req: Request, res: Response): Promise<Response> => {
        try {
            const userName = req.plainToken.user_name;
            const user = await adminService.getLoggedInUserInfo(userName);
            return res.status(STATUS.OK).send({
                data: user,
                message: "Logged In User Info Fetched Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: getLoggedInUserInfo :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ADMIN.ADMIN00000);
        }
    }
}

