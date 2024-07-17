import express, { Request, Response } from "express";
import { workflowAssignmentController } from '../controllers/workflowAssignmentController';

export const workflowAssignmentRouter = express.Router();

workflowAssignmentRouter.post("/create", workflowAssignmentController.create);