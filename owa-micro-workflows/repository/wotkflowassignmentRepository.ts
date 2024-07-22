import { CACHE_TTL } from "../constants/CONST";
import { MONGO_COLLECTIONS } from "../constants/MONGO_COLLECTIONS";
import { redis, logger, pg, mongoDB, mongoDBRead } from "owa-micro-common";
import {
    IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
} from "../types/custom";
import { PlainToken } from "../types/express";
import { WORKFLOW_ASSIGNMENT } from "../constants/QUERY";
import moment from "moment";


export const workflowAssignmentRepository = {

    createWorkflowsAssignment: async (assignment: IWorkflowAssignment): Promise<number> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowsAssignment`);
            const _query = {
                text: WORKFLOW_ASSIGNMENT.createWorkflowsAssignment,
                values: [assignment.workflow_id, assignment.workflow_triggered_by, assignment.created_by, assignment.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowAssignmentRepository :: createWorkflowsAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_assignment_id;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowsAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTaskAssignment: async (taskAssignment: IWorkflowTaskAssignment): Promise<number> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowTaskAssignment`);
            const _query = {
                text: WORKFLOW_ASSIGNMENT.createWorkflowTaskAssignment,
                values: [taskAssignment.workflow_assignment_id, taskAssignment.task_id, taskAssignment.assigned_to, taskAssignment.deadline_on, taskAssignment.assigned_by, taskAssignment.created_by, taskAssignment.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowAssignmentRepository :: createWorkflowTaskAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_task_assignment_id;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowTaskAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowsTaskFormSubmission: async (formSubmission: IWorkflowTaskFormSubmission): Promise<string> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowsTaskFormSubmission`);
            await mongoDB.insertOne(MONGO_COLLECTIONS.WORKFLOW_TASK_FORM_SUBMISSION, formSubmission);

            return formSubmission.workflows_task_form_submission_id;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowsTaskFormSubmission :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getWorkflowsTaskFormSubmission: async (workflowTaskAssignmentId: Number): Promise<IWorkflowTaskFormSubmission> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowsTaskFormSubmission`);
            const result: IWorkflowTaskFormSubmission = await mongoDBRead.findOne(MONGO_COLLECTIONS.WORKFLOW_TASK_FORM_SUBMISSION, {
                'workflow_task_assignment_id': workflowTaskAssignmentId
            });

            return result;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowsTaskFormSubmission :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTransaction: async (transitionId: Number, plainToken: PlainToken): Promise<number> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowTransaction`);
            const _query = {
                text: WORKFLOW_ASSIGNMENT.createWorkflowTransaction,
                values: [transitionId, plainToken.user_id, plainToken.user_id]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowAssignmentRepository :: createWorkflowTransaction :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_transaction_id;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowTransaction :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getStartNodeTransisionId: async (workflowId: number): Promise<number> => {
        try {
            logger.info(`workflowAssignmentRepository :: Inside createWorkflowTaskAssignment`);
            const _query = {
                text: WORKFLOW_ASSIGNMENT.getStartNodeTransisionId,
                values: [workflowId]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowAssignmentRepository :: createWorkflowTaskAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].transition_id;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: createWorkflowTaskAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    myTasks: async(assignedTo: Number) : Promise<any> => {
        try {
            const _queryForGetWorkflow = {
                text: WORKFLOW_ASSIGNMENT.getMyTasks,
                values: [assignedTo]
            };

            const result = await pg.executeQueryPromise(_queryForGetWorkflow);
            logger.debug(`workflowAssignmentRepository :: myTasks :: db result :: ${JSON.stringify(result)}`);
            
            return result;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: myTasks :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    assignedTasks: async(assignedBy: Number) : Promise<any> => {
        try {
            const _queryForGetWorkflow = {
                text: WORKFLOW_ASSIGNMENT.getAssignedTasks,
                values: [assignedBy]
            };

            const result = await pg.executeQueryPromise(_queryForGetWorkflow);
            logger.debug(`workflowAssignmentRepository :: assignedTasks :: db result :: ${JSON.stringify(result)}`);
            
            return result;
        } catch (error) {
            logger.error(`workflowAssignmentRepository :: assignedTasks :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    updateWorkflowTaskAssignmentStatus: async(workflowTaskAssignmentId: Number, updatedBy: Number)=> {
        try {
            logger.info(`workflowRepository :: Inside updateWorkflowTaskAssignmentStatus`);
            const _query = {
                text: WORKFLOW_ASSIGNMENT.updateWorkflowTaskAssignmentStatus,
                values: [ workflowTaskAssignmentId, updatedBy]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: updateWorkflowTaskAssignmentStatus :: result :: ${JSON.stringify(result)}`);
            return;
        } catch (error) {
            logger.error(`workflowRepository :: updateWorkflowTaskAssignmentStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
