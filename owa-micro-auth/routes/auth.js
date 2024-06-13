import express from "express";
import { authController } from "../controllers/authController";


const authRouter = express.Router();

authRouter.get("/health", authController.health);

authRouter.get("/validateToken", authController.validateToken);

authRouter.post("/login", authController.login);

authRouter.post("/postLoginUserUpdate", authController.postLoginUserUpdate);

authRouter.get("/:logout", authController.logout);

authRouter.post("/getForgetPasswordOtp", authController.getForgetPasswordOtp);

authRouter.get("/verifyForgetPasswordOtp", authController.verifyForgetPasswordOtp);

authRouter.get("/resetForgetPassword", authController.resetForgetPassword);

export {
    authRouter
}
