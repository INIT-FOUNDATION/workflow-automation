import express from "express";
import { rolesController } from "../controllers/rolesController";

const rolesRouter = express.Router();

rolesRouter.get("/list", rolesController.listRoles);

rolesRouter.post("/add", rolesController.addRole);

rolesRouter.post("/update", rolesController.updateRole);

rolesRouter.get("/:roleId", rolesController.getRoleById);

rolesRouter.post("/updateStatus", rolesController.updateRoleStatus);

rolesRouter.get("/accessList/:roleId", rolesController.getAccessListByRoleId);

rolesRouter.get("/menusList/:roleId", rolesController.getAccessListByRoleId);

rolesRouter.get("/combinedAccessList/:roleId", rolesController.getCombinedAccessListByRoleId);

rolesRouter.get("/defaultAccessList", rolesController.getDefaultAccessList);

export {
    rolesRouter
}
