import express from "express";
import { usersController } from "../controllers/usersController";
import fileUpload from "express-fileupload";
import { envUtils } from "owa-micro-common";

const usersRouter = express.Router();

usersRouter.use(fileUpload({
    limits: { 
        fileSize: envUtils.getNumberEnvVariableOrDefault("OWA_UPLOAD_FILE_SIZE_LIMIT", 5 * 1024 * 1024 )
    }
}));

usersRouter.post("/create", usersController.createUser);

usersRouter.post("/update", usersController.updateUser);

usersRouter.get("/:userId", usersController.getUserById);

usersRouter.post("/uploadProfilePicture", usersController.updateProfilePic);

usersRouter.get("/list/:roleId", usersController.listUsersByRoleId);

usersRouter.post("/list", usersController.listUsers);

usersRouter.post("/resetPassword/:userId", usersController.resetPasswordForUserId);

export {
    usersRouter
}
