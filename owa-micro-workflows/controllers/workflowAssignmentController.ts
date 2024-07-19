import { Request, Response } from "express";
import { logger, STATUS } from "owa-micro-common";
import { workflowAssignmentService } from "../services/workflowAssignmentService";
import { WORKFLOWS, ERRORCODE } from "../constants/ERRORCODE";
import {
    WorkflowAssignment, WorkflowTaskAssignment, WorkflowTaskFormSubmission, WorkflowTransaction
} from "../models/workflowAssignmentModel";
import {
    IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission, IWorkflowTransaction
} from "../types/custom";
import moment from "moment";

export const workflowAssignmentController = {

    create: async (req: Request, res: Response): Promise<Response> => {
        /*  
                #swagger.tags = ['Workflow Assignment']
                #swagger.summary = 'Create/Update workflow'
                #swagger.description = 'Endpoint to create workflow'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Token for authentication'
                }
                #swagger.parameters['body'] = {
                    "workflow_id": 71,
                    "task_assignments": [
                        {
                            "task_id": 2,
                            "assigned_to": 1,
                        "deadline_on": "2023-07-17"
                        },
                        {
                            "task_id": 3,
                            "assigned_to": 1,
                            "deadline_on": "2023-07-17"
                        }
                    ]
                } 
*/
        try {
            logger.info(`workflowAssignmentController :: Inside createWorflowAssignment`);

            const taskAssignments = req.body.task_assignments;
            const workflowTaskAssignments: IWorkflowTaskAssignment[] = [];

            const workflowAssignmentData: IWorkflowAssignment = new WorkflowAssignment(req.body, req.plainToken);
            const { error } = WorkflowAssignment.validateAssignment(workflowAssignmentData);
            if (error) {
                logger.error(`workflowAssignmentController :: createWorflowAssignment :: Workflow validation failed :: error :: ${JSON.stringify(error)}`);
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
            }

            for (const assignments of taskAssignments) {
                const workflowTaskAssignmentData: IWorkflowTaskAssignment = new WorkflowTaskAssignment(assignments, req.plainToken);
                const { error } = WorkflowTaskAssignment.validateAssignment(workflowTaskAssignmentData);
                if (error) {
                    logger.error(`workflowAssignmentController :: createWorkflowTaskAssignment :: Workflow Task Assignment validation failed :: error :: ${JSON.stringify(error)}`);
                    if (error.details != null)
                        return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.details[0].message });
                    else return res.status(STATUS.BAD_REQUEST).send({ errorCode: WORKFLOWS.WORKF0001, errorMessage: error.message });
                }
                workflowTaskAssignments.push(workflowTaskAssignmentData);
            }

            const workflowAssignmentId = await workflowAssignmentService.save(workflowAssignmentData, workflowTaskAssignments, req.plainToken);

            return res.status(STATUS.CREATED).send({
                data: workflowAssignmentId,
                message: "Workflow Assignments created Successfully",
            });

        } catch (error) {
            logger.error(`workflowAssignmentController :: createWorflowAssignment :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.ERROR0001);
        }
    }
}