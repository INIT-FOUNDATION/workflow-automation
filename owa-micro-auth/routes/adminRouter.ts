import express from 'express';
import { adminController } from "../controllers/adminController";

export const adminRouter = express.Router();

adminRouter.get("/validateToken", adminController.validateToken);

adminRouter.post("/login", adminController.login);

adminRouter.post("/postLoginUserUpdate", adminController.postLoginUserUpdate);

adminRouter.get("/logout", adminController.logout);

adminRouter.post("/getForgetPasswordOtp", adminController.getForgetPasswordOtp);

adminRouter.get("/verifyForgetPasswordOtp", adminController.verifyForgetPasswordOtp);

adminRouter.get("/resetForgetPassword", adminController.resetForgetPassword);
