import express, { Request, Response } from "express";
import { workflowController } from '../controllers/workflowController';

export const workflowRouter = express.Router();

workflowRouter.get("/health", workflowController.health);

workflowRouter.post("/create", workflowController.create);