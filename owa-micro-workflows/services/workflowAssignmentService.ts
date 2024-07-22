import { logger, redis } from "owa-micro-common";
import {
    IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission
} from "../types/custom";
import { PlainToken } from "../types/express";
import { workflowAssignmentRepository } from "../repository/wotkflowassignmentRepository";
import { workflowRepository } from "../repository/wotkflowRepository";

import { CACHE_TTL } from "../constants/CONST";

export const workflowAssignmentService = {

    save: async (workflowAssignmentData: IWorkflowAssignment, workflowTaskAssignments: IWorkflowTaskAssignment[], plainToken: PlainToken): Promise<Number> => {

        try {
            await workflowRepository.executeTransactionQuery("BEGIN");
            const workflowAssignmentId = await workflowAssignmentRepository.createWorkflowsAssignment(workflowAssignmentData);

            for (const assignments of workflowTaskAssignments) {
                assignments.workflow_assignment_id = workflowAssignmentId;
                await workflowAssignmentRepository.createWorkflowTaskAssignment(assignments);
            }
            const transitionId = await workflowAssignmentRepository.getStartNodeTransisionId(workflowAssignmentData.workflow_id);

            await workflowAssignmentRepository.createWorkflowTransaction(transitionId, plainToken);

            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowAssignmentId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    myTasks: async (assignedTo: Number): Promise<any> => {
        const workflowNotificationTaskList = await workflowAssignmentRepository.myTasks(assignedTo);
        return workflowNotificationTaskList;
    },

    assignedTasks: async (assignedBy: Number): Promise<any> => {
        const workflowNotificationTaskList = await workflowAssignmentRepository.assignedTasks(assignedBy);
        return workflowNotificationTaskList;
    },

    taskFormSubmission: async (taskFormSubmissionData: IWorkflowTaskFormSubmission): Promise<string> => {

        try {
            await workflowRepository.executeTransactionQuery("BEGIN");
            const workflowAssignmentId = await workflowAssignmentRepository.createWorkflowsTaskFormSubmission(taskFormSubmissionData);
            await workflowAssignmentRepository.updateWorkflowTaskAssignmentStatus(taskFormSubmissionData.workflow_task_assignment_id, taskFormSubmissionData.updated_by);
            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowAssignmentId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    getSubmittedTaskForm: async (workflowTaskAssignmentId: Number): Promise<IWorkflowTaskFormSubmission> => {
        const workflow = await workflowAssignmentRepository.getWorkflowsTaskFormSubmission(workflowTaskAssignmentId);
        return workflow;
    },
};