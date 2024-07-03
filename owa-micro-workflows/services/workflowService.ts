import { logger, redis } from "owa-micro-common";
import {
    IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
} from "../types/custom";
import { workflowRepository } from "../repository/wotkflowRepository";
import { CACHE_TTL } from "../constants/CONST";
import moment from "moment";
import * as arrayUtil from "../utility/arrayUtility";


export const workflowService = {

    save: async (workflowData: IWorkflow, workflowTasks: IWorkflowTask[],
        workflowNotificationTasks: IWorkflowNotificationTask[], workflowDecisionTasks: IWorkflowDecisionTask[],
        workflowTransitions: IWorkflowTransition[]): Promise<number> => {

        try {
            const taskIdsMapping = {};
            await workflowRepository.executeTransactionQuery("BEGIN");

            const workflowId = await workflowRepository.createWorkflow(workflowData);

            for (const workflowTask of workflowTasks) {
                workflowTask.workflow_id = workflowId;

                const taskId = await workflowRepository.createWorkflowTask(workflowTask);
                taskIdsMapping[workflowTask.task_id] = taskId;
            }

            for (const workflowNotificationTask of workflowNotificationTasks) {
                workflowNotificationTask.workflow_id = workflowId;

                const taskId = await workflowRepository.createWorkflowNotificationTasks(workflowNotificationTask);
                taskIdsMapping[workflowNotificationTask.notification_task_id] = taskId;
            }

            for (const workflowDecisionTask of workflowDecisionTasks) {
                const conditions = workflowDecisionTask.conditions;
                workflowDecisionTask.workflow_id = workflowId;

                const taskId = await workflowRepository.createWorkflowDecisionTasks(workflowDecisionTask);
                taskIdsMapping[workflowDecisionTask.decision_task_id] = taskId;
                for (const condition of conditions) {
                    condition.decision_task_id = taskId;
                    await workflowRepository.createWorkflowDecisionConditions(condition);
                }
            }

            for (const workflowTransition of workflowTransitions) {
                workflowTransition.workflow_id = workflowId;
                workflowTransition.from_task_id = taskIdsMapping[workflowTransition.from_task_id];
                workflowTransition.to_task_id = taskIdsMapping[workflowTransition.to_task_id];
                await workflowRepository.createWorkflowTransition(workflowTransition);
            }

            await workflowRepository.executeTransactionQuery("COMMIT");
            return workflowId;

        } catch (error) {
            await workflowRepository.executeTransactionQuery("ROLLBACK");
            logger.error(`workflowService :: save :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
};
