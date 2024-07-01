import express from 'express';
import { userController } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/login", userController.login);

userRouter.post("/generateOTP", userController.generateOTP);

userRouter.post("/validateOTP", userController.validateOTP);

userRouter.post("/logout", userController.logout);