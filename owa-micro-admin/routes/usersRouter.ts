import express from "express";
import { usersController } from "../controllers/usersController";

const usersRouter = express.Router();

usersRouter.get("/create", usersController.createUser);

usersRouter.post("/update", usersController.addRole);

usersRouter.get("/:userId", usersController.getRoleById);

usersRouter.post("/list", usersController.updateRoleStatus);

usersRouter.get("/passwordPolicy", usersController.getAccessListByRoleId);

usersRouter.post("/passwordPolicy", usersController.getAccessListByRoleId);

usersRouter.post("/uploadProfilePicture", usersController.getCombinedAccessListByRoleId);

usersRouter.get("/downloadProfilePicture", usersController.getDefaultAccessList);

usersRouter.post("/listByRole/:roleId", usersController.updateRoleStatus);

export {
    usersRouter
}
