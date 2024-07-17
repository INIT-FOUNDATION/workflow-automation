import express, { Request, Response } from "express";
import { workflowController } from '../controllers/workflowController';

export const workflowRouter = express.Router();

workflowRouter.get("/health", workflowController.health);

workflowRouter.post("/create", workflowController.create);

workflowRouter.post("/update", workflowController.create);

workflowRouter.post("/list", workflowController.listWorkflows);

workflowRouter.get("/list", workflowController.getListOfWorkflows);

workflowRouter.get("/id/:workflowId", workflowController.getByworkflowId);

workflowRouter.get("/nodesList", workflowController.nodesList);

workflowRouter.post("/changeStatus/:workflowId", workflowController.changeStatus);

workflowRouter.get("/taskList/:workflowId", workflowController.taskList);