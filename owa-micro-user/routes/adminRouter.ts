import express from "express";
import { adminController } from "../controller/adminController";

export const adminRouter = express.Router();

adminRouter.get("/loggedUserInfo", adminController.getLoggedInUserInfo);
