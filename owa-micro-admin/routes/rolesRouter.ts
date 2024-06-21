import express from "express";
import { rolesController } from "../controllers/rolesController";

const rolesRouter = express.Router();

rolesRouter.get("/list", rolesController.listRoles);

rolesRouter.post("/add", rolesController.addRole);

rolesRouter.post("/update", rolesController.updateRole);

rolesRouter.get("/listLevels", rolesController.listLevels);

rolesRouter.get("/defaultAccessList", rolesController.getDefaultAccessList);

rolesRouter.get("/:roleId", rolesController.getRoleById);

rolesRouter.post("/updateStatus", rolesController.updateRoleStatus);

rolesRouter.get("/accessList/:roleId", rolesController.getAccessListByRoleId);

rolesRouter.get("/menusList/:roleId", rolesController.getMenusListByRoleId);

rolesRouter.get("/listBylevel/:level", rolesController.getRolesByLevel);

export {
    rolesRouter
}
