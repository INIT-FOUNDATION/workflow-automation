import express, { Request, Response } from "express";
import { workflowController } from '../controllers/workflowController';

export const workflowRouter = express.Router();

workflowRouter.get("/health", workflowController.health);

workflowRouter.post("/create", workflowController.create);

workflowRouter.post("/update", workflowController.create);

workflowRouter.post("/list", workflowController.listWorkflows);

workflowRouter.get("/id/:workflowId", workflowController.getByworkflowId);

workflowRouter.get("/nodesList", workflowController.nodesList);