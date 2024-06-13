import { Response } from "express";
import { Request } from "../types/express";
import { validateLoginDetails } from "../models/auth";
import { STATUS, redis, generateToken, logger, SECRET_KEY, passwordPolicy } from "owa-micro-common";
import { ERRORCODE } from "../constants/ERRORCODE";
import { decryptPayload, SERVICES } from "../constants/CONST";
import { authService } from "../services/authService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { 
    updateUserLoggedInOut
 } from "../constants/QUERY";


export const authController = {
    health: async(req: Request, res: Response): Response<Response> => {
        return res.status(STATUS.OK).send({
            data: null,
            message: "Auth Service is Healthy",
        });
    },
    validateToken: async(req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.header("authorization");
            jwt.verify(token, SECRET_KEY.SECRET_KEY);
            return res.status(STATUS.OK).send({message: "Success"});
        } catch (error) {
            logger.error(`authController :: validateToken :: ${error.message} :: ${error}`)
        }
    },
    login: async(req: Request, res: Response): Promise<Response> => {
        try { 
            const plainToken = req.plainToken;
            const user: IUser = new User(req.body)
            const {error} = await validateLoginDetails(req.body);
            logger.error("ERROR", error);

            if (error) {
                if (error.details)
                    return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
                else return res.status(STATUS.BAD_REQUEST).send(error.message);
            }
            await authService.login(user);

            return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0001", "error":"${ERRORCODE.USRAUT0001}"}`);
        } catch (error) {
            logger.error(`authController :: login :: ${error.message} :: ${error}`)
        }
    },
    postLoginUserUpdate: async(req: Request, res: Response): Promise<Response> => {
        try { 
            await updateUserLoggedInOut(1, req.body.user_name);
            res.status(STATUS.OK).send('User login details successfully updated!');
        } catch (error) {
            logger.error(`authController :: postLoginUserUpdate :: ${error.message} :: ${error}`)
        }
    },
    logout: async(req: Request, res: Response): Promise<Response> => {
        try { 
            await updateUserLoggedInOut(0, req.plainToken.user_name);
            redis.deleteKey(req.plainToken.user_name);
            redis.deleteKey(`USER_PERMISSIONS_${req.plainToken.user_name}`);
            redis.deleteKey(`LOGGED_IN_USER_DETAILS_${req.plainToken.user_name}`);
            redis.deleteKey(`User|Username:${req.plainToken.user_name}`);
            redis.deleteKey(`COMBINED_ACCESS_LIST|USER:${req.plainToken.user_id}`);
            res.status(STATUS.OK).send(`Username | ${req.plainToken.user_name} | Successfully Logged Out!!`);
        } catch (error) {
            logger.error(`authController :: logout :: ${error.message} :: ${error}`)
        }
    },
    getForgetPasswordOtp: async(req: Request, res: Response): Promise<Response> => {
        try { 
            let mobile_number = req.body.mobile_number;
            if (!mobile_number || mobile_number.toString().length !== 10) {
                return res.status(STATUS.BAD_REQUEST).json({ errorCode: "CONFIG0023", error: ERRORCODE.CONFIG0023 });
            }
      
            await authService.getForgetPasswordOtp(mobile_number);
        } catch (error) {
            logger.error(`authController :: getForgetPasswordOtp :: ${error.message} :: ${error}`)
        }
    },
    verifyForgetPasswordOtp: async(req: Request, res: Response): Promise<Response> => {
        try { 
            let otp = decryptPayload(req.body.otp);
            let txnId = req.body.txnId;
          
            if (!otp || !txnId) {
                return res.status(STATUS.BAD_REQUEST).send(`{"errorCode":"USRAUT0012", "error":"${ERRORCODE.USRAUT0012}"}`);
            }
            const data = await authService.verifyForgetPasswordOtp(txnId, otp);
            return res.status(STATUS.OK).send({
                data: data,
                message: "Verify OTP Success",
            });
        } catch (error) {
            logger.error(`authController :: verifyForgetPasswordOtp :: ${error.message} :: ${error}`)
        }
    },
    resetForgetPassword: async(req: Request, res: Response): Promise<Response> => {
        try { 
            const data = await authService.resetForgetPassword(req.body);
            return res.status(STATUS.OK).send({
                data: data,
                message: "Reset Password Success",
            });
        } catch (error) {
            logger.error(`authController :: resetForgetPassword :: ${error.message} :: ${error}`)
        }
    }
}
