import { logger, redis } from "owa-micro-common";
import {
    IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction
} from "../types/custom";
import { workflowAssignmentRepository } from "../repository/wotkflowassignmentRepository";
import { workflowRepository } from "../repository/wotkflowRepository";

import { CACHE_TTL } from "../constants/CONST";

export const workflowAssignmentService = {

    save: async (workflowAssignmentData: IWorkflowAssignment, workflowTaskAssignments: IWorkflowTaskAssignment[]): Promise<Number> => {

        try {
            await workflowRepository.executeTransactionQuery("BEGIN");
            const workflowAssignmentId = await workflowAssignmentRepository.createWorkflowsAssignment(workflowAssignmentData);

            for (const assignments of workflowTaskAssignments) {
                assignments.workflow_assignment_id = workflowAssignmentId;
                await workflowAssignmentRepository.createWorkflowTaskAssignment(assignments);
            }

            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowAssignmentId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
};