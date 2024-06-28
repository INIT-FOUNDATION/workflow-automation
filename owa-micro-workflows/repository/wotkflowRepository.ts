import { CACHE_TTL } from "../constants/CONST";
import { redis, logger, pg } from "owa-micro-common";
import { IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, 
 } from "../types/custom";
 import { WORKFLOW } from "../constants/QUERY";
import moment from "moment";


export const workflowRepository = {

    createWorkflow: async(workflow: IWorkflow) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflow`);
            const _query = {
                text: WORKFLOW.createWorkflow,
                values: [ workflow.workflow_name, workflow.workflow_description, workflow.created_by, workflow.updated_by]
            }

            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflow :: result :: ${JSON.stringify(result)}`);
            return result[0].form_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflow :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },

    createWorkflowTask: async(task: IWorkflowTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTask`);
            const _query = {
                text: WORKFLOW.createWorkflowtask,
                values: [task.workflow_id, task.task_name, task.task_description, task.form_id, task.created_by, task.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTask :: result :: ${JSON.stringify(result)}`);
            return result[0].task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTask :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowNotificationTasks: async(notificationTask: IWorkflowNotificationTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowNotificationTasks`);
            const _query = {
                text: WORKFLOW.ceateWorkflowNotificationTasks,
                values: [notificationTask.workflow_id, notificationTask.notification_task_name, notificationTask.notification_task_description, notificationTask.notification_type, notificationTask.email_subject, notificationTask.email_body, notificationTask.sms_body, notificationTask.template_id, notificationTask.placeholders, notificationTask.recipient_emails, notificationTask.recipient_mobilenumber, notificationTask.created_by, notificationTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowNotificationTasks :: result :: ${JSON.stringify(result)}`);
            return result[0].notification_task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowNotificationTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowDecisionTasks: async(decisionTask: IWorkflowDecisionTask) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowDecisionTasks`);
            const _query = {
                text: WORKFLOW.createWorkflowDecisionTasks,
                values: [decisionTask.workflow_id, decisionTask.decision_task_name, decisionTask.decision_task_description, decisionTask.created_by, decisionTask.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowDecisionTasks :: result :: ${JSON.stringify(result)}`);
            return result[0].decision_task_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowDecisionTasks :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowDecisionConditions: async(decisionCondition: IWorkflowDecisionCondition) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowDecisionConditions`);
            const _query = {
                text: WORKFLOW.createWorkflowDecisionConditions,
                values: [decisionCondition.decision_task_id, decisionCondition.operand_one, decisionCondition.operator, decisionCondition.operand_two, decisionCondition.condition_type, decisionCondition.created_by, decisionCondition.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowDecisionConditions :: result :: ${JSON.stringify(result)}`);
            return result[0].condition_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowDecisionConditions :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTransition: async(transition: IWorkflowTransition) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTransition`);
            const _query = {
                text: WORKFLOW.createWorkflowTransition,
                values: [transition.from_task_id, transition.to_task_id, transition.from_task_type, transition.to_task_type, transition.condition_type, transition.created_by, transition.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTransition :: result :: ${JSON.stringify(result)}`);
            return result[0].transition_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTransition :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowsAssignment: async(assignment: IWorkflowAssignment) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowsAssignment`);
            const _query = {
                text: WORKFLOW.createWorkflowsAssignment,
                values: [assignment.workflow_id, assignment.workflow_triggered_on, assignment.workflow_triggered_by, assignment.created_by, assignment.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowsAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_assignment_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowsAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTaskAssignment: async(taskAssignment: IWorkflowTaskAssignment) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTaskAssignment`);
            const _query = {
                text: WORKFLOW.createWorkflowTaskAssignment,
                values: [taskAssignment.workflow_assignment_id, taskAssignment.task_id, taskAssignment.assigned_to, taskAssignment.assigned_on, taskAssignment.assigned_by, taskAssignment.created_by, taskAssignment.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTaskAssignment :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_task_assignment_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTaskAssignment :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowsTaskFormSubmission: async(formSubmission: IWorkflowTaskFormSubmission) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowsTaskFormSubmission`);
            const _query = {
                text: WORKFLOW.createwWrkflowsTaskFormSubmission,
                values: [formSubmission.workflow_task_assignment_id, formSubmission.form_id, formSubmission.form_data, formSubmission.form_submitted_by, formSubmission.form_submitted_on, formSubmission.created_by, formSubmission.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowsTaskFormSubmission :: result :: ${JSON.stringify(result)}`);
            return result[0].workflows_task_form_submission_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowsTaskFormSubmission :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    createWorkflowTransaction: async(transaction: IWorkflowTransaction) : Promise<number> => {
        try {
            logger.info(`workflowRepository :: Inside createWorkflowTransaction`);
            const _query = {
                text: WORKFLOW.createWorkflowTransaction,
                values: [transaction.transition_id, transaction.created_by, transaction.updated_by]
            }
    
            const result = await pg.executeQueryPromise(_query);
            logger.info(`workflowRepository :: createWorkflowTransaction :: result :: ${JSON.stringify(result)}`);
            return result[0].workflow_transaction_id;
        } catch (error) {
            logger.error(`workflowRepository :: createWorkflowTransaction :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    
    
    
    
    
    
    
    
    

    executeTransactionQuery: async(query: string) : Promise<void> => {
        try{
            logger.info(`workflowRepository :: executeTransactionQuery :: query :: ${query}`);
            await pg.transactionQuery(query);
        } catch(error) {
            logger.error(`workflowRepository :: executeTransactionQuery :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
};
