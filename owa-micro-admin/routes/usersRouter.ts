import express from "express";
import { usersController } from "../controllers/usersController";

const usersRouter = express.Router();

usersRouter.post("/create", usersController.createUser);

usersRouter.post("/update", usersController.updateUser);

usersRouter.get("/:userId", usersController.getUserById);

usersRouter.get("/list/:roleId", usersController.listUsersByRoleId);

usersRouter.post("/list", usersController.listUsers);

usersRouter.post("/resetPassword/:userId", usersController.resetPasswordForUserId);

usersRouter.get("/reportingUsers/:roleId/:type", usersController.reportingUsersList);

usersRouter.post("/updateStatus", usersController.updateStatus);

export {
    usersRouter
}
