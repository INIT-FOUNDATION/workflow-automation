import { Response } from "express";
import { Request } from "../types/express";
import { validateLoginDetails } from "../models/auth";
import { STATUS, redis, logger, SECRET_KEY } from "owa-micro-common";
import { ERRORCODE } from "../constants/ERRORCODE";
import { decryptPayload } from "../constants/CONST";
import { adminService } from "../services/adminService";
import jwt from "jsonwebtoken";
import { IUser } from "../types/custom";

export const adminController = {
    validateToken: async (req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.header("authorization");
            jwt.verify(token, SECRET_KEY.SECRET_KEY);
            return res.status(STATUS.OK).send({ data: null, message: "Token Validated Successfully" });
        } catch (error) {
            logger.error(`adminController :: validateToken :: ${error.message} :: ${error}`)
            return res.status(STATUS.INTERNAL_SERVER_ERROR)
        }
    },
    login: async (req: Request, res: Response): Promise<Response> => {
        try {
            const user: IUser = req.body;
            const { error } = await validateLoginDetails(req.body);

            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }
            await adminService.login(user);

            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);
        } catch (error) {
            logger.error(`adminController :: login :: ${error.message} :: ${error}`)
        }
    },
    postLoginUserUpdate: async (req: Request, res: Response): Promise<Response> => {
        try {
            await adminService.updateUserLoggedInOut(1, req.body.user_name);
            return res.status(STATUS.OK).send('User login details successfully updated!');
        } catch (error) {
            logger.error(`adminController :: postLoginUserUpdate :: ${error.message} :: ${error}`)
        }
    },
    logout: async (req: Request, res: Response): Promise<Response> => {
        try {
            await adminService.updateUserLoggedInOut(0, req.plainToken.user_name);
            redis.deleteKey(req.plainToken.user_name);
            redis.deleteKey(`USER_PERMISSIONS_${req.plainToken.user_name}`);
            redis.deleteKey(`LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`);
            redis.deleteKey(`User|Username:${req.plainToken.user_name}`);
            redis.deleteKey(`COMBINED_ACCESS_LIST|USER:${req.plainToken.user_id}`);
            return res.status(STATUS.OK).send(`Username | ${req.plainToken.user_name} | Successfully Logged Out!!`);
        } catch (error) {
            logger.error(`adminController :: logout :: ${error.message} :: ${error}`)
        }
    },
    getForgetPasswordOtp: async (req: Request, res: Response): Promise<Response> => {
        try {
            let mobile_number = req.body.mobile_number;
            if (!mobile_number || mobile_number.toString().length !== 10) {
                return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONFIG0023", error: ERRORCODE.CONFIG0023 });
            }

            const txnId = await adminService.getForgetPasswordOtp(mobile_number);
            return res.status(STATUS.OK).send({
                data: { txnId },
                message: "Fetched Forget Password OTP Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: getForgetPasswordOtp :: ${error.message} :: ${error}`)
        }
    },
    verifyForgetPasswordOtp: async (req: Request, res: Response): Promise<Response> => {
        try {
            let otp = decryptPayload(req.body.otp);
            let txnId = req.body.txnId;

            if (!otp || !txnId) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.USRAUT0012}"}`);
            }
            const data = await adminService.verifyForgetPasswordOtp(txnId, otp);
            return res.status(STATUS.OK).send({
                data: data,
                message: "Fetched Verify Forget Password OTP Success Successfully",
            });
        } catch (error) {
            logger.error(`adminController :: verifyForgetPasswordOtp :: ${error.message} :: ${error}`)
        }
    },
    resetForgetPassword: async (req: Request, res: Response): Promise<Response> => {
        try {
            let new_password = decryptPayload(req.body.new_password);
            let confirm_password = decryptPayload(req.body.confirm_password);

            const { txnId } = req.body;

            if (!txnId) {
                return res.send(STATUS.BAD_REQUEST).json(`{"errorCode":"USRPRF00027", "error":"${ERRORCODE.USRPRF00027}"}`);
            }

            if (new_password !== confirm_password) {
                return res.send(STATUS.BAD_REQUEST).json({ "error": "Passwords do not match" });
            }

            if (!/^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/.test(new_password)) {
                return res.send(STATUS.BAD_REQUEST).json({ "error": "Password must be at least 8 characters long and contain at least one letter and one digit" });
            }
            const data = await adminService.resetForgetPassword(req.body);
            return res.status(STATUS.OK).send({
                data: data,
                message: "Reset Password Success",
            });
        } catch (error) {
            logger.error(`adminController :: resetForgetPassword :: ${error.message} :: ${error}`)
        }
    }
}
