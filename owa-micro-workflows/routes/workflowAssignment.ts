import express, { Request, Response } from "express";
import { workflowAssignmentController } from '../controllers/workflowAssignmentController';

export const workflowAssignmentRouter = express.Router();

workflowAssignmentRouter.post("/create", workflowAssignmentController.create);

workflowAssignmentRouter.get("/myTasks", workflowAssignmentController.myTasks);

workflowAssignmentRouter.get("/assignedTasks", workflowAssignmentController.assignedTasks);

workflowAssignmentRouter.post("/taskFormSubmission", workflowAssignmentController.taskFormSubmission);

workflowAssignmentRouter.get("/getSubmittedTaskForm/:workflowTaskAssignmentId", workflowAssignmentController.getSubmittedTaskForm);