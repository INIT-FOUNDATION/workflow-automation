import Joi from "joi";
import { IWorkflow, IWorkflowTask, IWorkflowNotificationTask, IWorkflowDecisionTask, IWorkflowDecisionCondition,
    IWorkflowTransition, IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
 } from "../types/custom";
import moment from "moment";
import { PlainToken } from "../types/express";
import { WORKFLOWS } from "../constants/ERRORCODE";


class Workflow implements IWorkflow {
    workflow_id: number;
    workflow_name: string;
    workflow_description: string;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(workflow: IWorkflow, plainToken: PlainToken) {
        this.workflow_id = workflow.workflow_id;
        this.workflow_name = workflow.workflow_name;
        this.workflow_description = workflow.workflow_description;
        this.status = workflow.status || 1;
        this.created_by = plainToken.user_id;
        this.updated_by = plainToken.user_id;
    }

    static validateWorkflow = (workflow: IWorkflow): Joi.ValidationResult => {
        const workflowSchema = Joi.object({
            workflow_id: Joi.number().integer().optional(),
            workflow_name: Joi.string().min(3).max(50).required().error(
                new Error(`${WORKFLOWS.WORKF0001}`)
            ),
            workflow_description: Joi.string().required().error(
                new Error(`${WORKFLOWS.WORKF0002}`)
            ),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return workflowSchema.validate(workflow);
    }
}

class WorkflowTask implements IWorkflowTask {
    task_id: number;
    workflow_id: number;
    node_id: number;
    task_name: string;
    task_description: string;
    form_id: number;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(workflowTask: IWorkflowTask, plainToken: PlainToken) {
        this.task_id = workflowTask.task_id;
        this.workflow_id = workflowTask.workflow_id;
        this.node_id = workflowTask.node_id;
        this.task_name = workflowTask.task_name;
        this.task_description = workflowTask.task_description;
        this.form_id = workflowTask.form_id;
        this.status = workflowTask.status || 1;
        this.created_by = plainToken.user_id;
        this.updated_by = plainToken.user_id;
    }

    static validateWorkflowTask = (workflowTask: IWorkflowTask): Joi.ValidationResult => {
        const workflowTaskSchema = Joi.object({
            task_id: Joi.number().integer().optional(),
            workflow_id: Joi.number().integer().required(),
            node_id: Joi.number().integer().required(),
            task_name: Joi.string().min(3).max(50).required().error(
                new Error(`${WORKFLOWS.WORKF0001}`)
            ),
            task_description: Joi.string().optional().allow(null).error(
                new Error(`${WORKFLOWS.WORKF0002}`)
            ),
            form_id: Joi.number().integer().required(),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return workflowTaskSchema.validate(workflowTask);
    }
}

class WorkflowNotificationTask implements IWorkflowNotificationTask {
    notification_task_id: number;
    workflow_id: number;
    node_id: number;
    notification_task_name: string;
    notification_task_description: string;
    notification_type: string;
    email_subject: string;
    email_body: string;
    sms_body: string;
    template_id: string;
    placeholders: object;
    recipient_emails: string;
    recipient_mobilenumber: string;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(notificationTask: IWorkflowNotificationTask, plainToken: PlainToken) {
        this.notification_task_id = notificationTask.notification_task_id || 0;
        this.workflow_id = notificationTask.workflow_id;
        this.node_id = notificationTask.node_id;
        this.notification_task_name = notificationTask.notification_task_name;
        this.notification_task_description = notificationTask.notification_task_description;
        this.notification_type = notificationTask.notification_type;
        this.email_subject = notificationTask.email_subject;
        this.email_body = notificationTask.email_body;
        this.sms_body = notificationTask.sms_body;
        this.template_id = notificationTask.template_id;
        this.placeholders = notificationTask.placeholders;
        this.recipient_emails = notificationTask.recipient_emails;
        this.recipient_mobilenumber = notificationTask.recipient_mobilenumber;
        this.status = notificationTask.status !== undefined ? notificationTask.status : 1;
        this.created_by = notificationTask.created_by || plainToken.user_id;
        this.updated_by = notificationTask.updated_by || plainToken.user_id;
    }

    static validateNotificationTask = (notificationTask: IWorkflowNotificationTask): Joi.ValidationResult => {
        const notificationTaskSchema = Joi.object({
            notification_task_id: Joi.number().integer().optional(),
            workflow_id: Joi.number().integer().required(),
            node_id: Joi.number().integer().required(),
            notification_task_name: Joi.string().min(3).max(50).required().error(
                new Error('NOTIFICATION_TASK00002: Notification task name must be between 3 and 50 characters.')
            ),
            notification_task_description: Joi.string().required().error(
                new Error('NOTIFICATION_TASK00003: Notification task description is required.')
            ),
            notification_type: Joi.string().valid('SMS', 'WHATSAPP', 'EMAIL').required(),
            email_subject: Joi.string().allow(null, ''),
            email_body: Joi.string().allow(null, ''),
            sms_body: Joi.string().allow(null, ''),
            template_id: Joi.string().allow(null, ''),
            placeholders: Joi.object().allow(null),
            recipient_emails: Joi.string().allow(null, ''),
            recipient_mobilenumber: Joi.string().allow(null, ''),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return notificationTaskSchema.validate(notificationTask);
    }
}

class WorkflowDecisionTask implements IWorkflowDecisionTask {
    decision_task_id: number;
    workflow_id: number;
    node_id: number;
    decision_task_name: string;
    decision_task_description: string;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(decisionTask: IWorkflowDecisionTask, plainToken: PlainToken) {
        this.decision_task_id = decisionTask.decision_task_id || 0;
        this.workflow_id = decisionTask.workflow_id;
        this.node_id = decisionTask.node_id;
        this.decision_task_name = decisionTask.decision_task_name;
        this.decision_task_description = decisionTask.decision_task_description;
        this.status = decisionTask.status !== undefined ? decisionTask.status : 1;
        this.created_by = decisionTask.created_by || plainToken.user_id;
        this.updated_by = decisionTask.updated_by || plainToken.user_id;
    }

    static validateDecisionTask = (decisionTask: IWorkflowDecisionTask): Joi.ValidationResult => {
        const decisionTaskSchema = Joi.object({
            decision_task_id: Joi.number().integer().optional(),
            workflow_id: Joi.number().integer().required(),
            node_id: Joi.number().integer().required(),
            decision_task_name: Joi.string().min(3).max(50).required().error(
                new Error('DECISION_TASK00002: Decision task name must be between 3 and 50 characters.')
            ),
            decision_task_description: Joi.string().required().error(
                new Error('DECISION_TASK00003: Decision task description is required.')
            ),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return decisionTaskSchema.validate(decisionTask);
    }
}

class WorkflowDecisionCondition implements IWorkflowDecisionCondition {
    condition_id: number;
    decision_task_id: number;
    operand_one: string;
    operator: string;
    operand_two: string;
    condition_type: string;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(decisionCondition: IWorkflowDecisionCondition, plainToken: PlainToken) {
        this.condition_id = decisionCondition.condition_id || 0;
        this.decision_task_id = decisionCondition.decision_task_id;
        this.operand_one = decisionCondition.operand_one;
        this.operator = decisionCondition.operator;
        this.operand_two = decisionCondition.operand_two;
        this.condition_type = decisionCondition.condition_type;
        this.status = decisionCondition.status !== undefined ? decisionCondition.status : 1;
        this.created_by = decisionCondition.created_by || plainToken.user_id;
        this.updated_by = decisionCondition.updated_by || plainToken.user_id;
    }

    static validateDecisionCondition = (decisionCondition: IWorkflowDecisionCondition): Joi.ValidationResult => {
        const decisionConditionSchema = Joi.object({
            condition_id: Joi.number().integer().optional(),
            decision_task_id: Joi.number().integer().required(),
            operand_one: Joi.string().required().error(
                new Error('DECISION_CONDITION00001: Operand one is required.')
            ),
            operator: Joi.string().valid('=', '!=', '>', '<', '>=', '<=').required(),
            operand_two: Joi.string().required().error(
                new Error('DECISION_CONDITION00002: Operand two is required.')
            ),
            condition_type: Joi.string().valid('MATCHED', 'NOT-MATCHED').required(),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return decisionConditionSchema.validate(decisionCondition);
    }
}

class WorkflowTransition implements IWorkflowTransition {
    transition_id: number;
    from_task_id: number;
    to_task_id: number;
    from_node_id: number;
    to_node_id: number;
    from_task_type: string;
    to_task_type: string;
    condition_type: string;
    status: number;
    date_created: string;
    date_updated: string;    created_by: number;
    updated_by: number;

    constructor(transition: IWorkflowTransition, plainToken: PlainToken) {
        this.transition_id = transition.transition_id || 0;
        this.from_task_id = transition.from_task_id;
        this.to_task_id = transition.to_task_id;
        this.from_node_id = transition.from_node_id;
        this.to_node_id = transition.to_node_id;
        this.from_task_type = transition.from_task_type;
        this.to_task_type = transition.to_task_type;
        this.condition_type = transition.condition_type;
        this.status = transition.status !== undefined ? transition.status : 1;
        this.created_by = transition.created_by || plainToken.user_id;
        this.updated_by = transition.updated_by || plainToken.user_id;
    }

    static validateTransition = (transition: IWorkflowTransition): Joi.ValidationResult => {
        const transitionSchema = Joi.object({
            transition_id: Joi.number().integer().optional(),
            from_task_id: Joi.number().integer().required(),
            to_task_id: Joi.number().integer().required(),
            from_node_id: Joi.number().integer().required(),
            to_node_id: Joi.number().integer().required(),
            from_task_type: Joi.string().valid('D', 'T', 'N').required(),
            to_task_type: Joi.string().valid('D', 'T', 'N').required(),
            condition_type: Joi.string().valid('MATCHED', 'NOT-MATCHED').required(),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return transitionSchema.validate(transition);
    }
}

class WorkflowAssignment implements IWorkflowAssignment {
    workflow_assignment_id: number;
    workflow_id: number;
    workflow_triggered_on: string;
    workflow_triggered_by: number;
    workflow_status: number;
    created_by: number;
    updated_by: number;

    constructor(assignment: IWorkflowAssignment, plainToken: PlainToken) {
        this.workflow_assignment_id = assignment.workflow_assignment_id || 0;
        this.workflow_id = assignment.workflow_id;
        this.workflow_triggered_on = assignment.workflow_triggered_on || moment().toISOString();
        this.workflow_triggered_by = assignment.workflow_triggered_by || plainToken.user_id;
        this.workflow_status = assignment.workflow_status !== undefined ? assignment.workflow_status : 1;
        this.created_by = assignment.created_by || plainToken.user_id;
        this.updated_by = assignment.updated_by || plainToken.user_id;
    }

    static validateAssignment = (assignment: IWorkflowAssignment): Joi.ValidationResult => {
        const assignmentSchema = Joi.object({
            workflow_assignment_id: Joi.number().integer().optional(),
            workflow_id: Joi.number().integer().required(),
            workflow_triggered_on: Joi.string().allow("", null),
            workflow_triggered_by: Joi.number().integer().optional(),
            workflow_status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return assignmentSchema.validate(assignment);
    }
}

class WorkflowTaskAssignment implements IWorkflowTaskAssignment {
    workflow_task_assignment_id: number;
    workflow_assignment_id: number;
    task_id: number;
    assigned_to: number;
    assigned_on: string;
    assigned_by: number;
    task_status: number;
    created_by: number;
    updated_by: number;

    constructor(assignment: IWorkflowTaskAssignment) {
        this.workflow_task_assignment_id = assignment.workflow_task_assignment_id || 0;
        this.workflow_assignment_id = assignment.workflow_assignment_id;
        this.task_id = assignment.task_id;
        this.assigned_to = assignment.assigned_to;
        this.assigned_on = assignment.assigned_on || moment().toISOString();
        this.assigned_by = assignment.assigned_by;
        this.task_status = assignment.task_status !== undefined ? assignment.task_status : 1;
        this.created_by = assignment.created_by;
        this.updated_by = assignment.updated_by;
    }

    static validateAssignment = (assignment: IWorkflowTaskAssignment): Joi.ValidationResult => {
        const assignmentSchema = Joi.object({
            workflow_task_assignment_id: Joi.number().integer().optional(),
            workflow_assignment_id: Joi.number().integer().required(),
            task_id: Joi.number().integer().required(),
            assigned_to: Joi.number().integer().optional(),
            assigned_on: Joi.string().allow('', null),
            assigned_by: Joi.number().integer().optional(),
            task_status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return assignmentSchema.validate(assignment);
    }
}

class WorkflowTaskFormSubmission implements IWorkflowTaskFormSubmission {
    workflows_task_form_submission_id: number;
    workflow_task_assignment_id: number;
    form_id: number;
    form_data: object;
    form_submitted_by: number;
    form_submitted_on: string;
    form_status: number;
    created_by: number;
    updated_by: number;

    constructor(taskFormSubmission: IWorkflowTaskFormSubmission, plainToken: PlainToken) {
        this.workflows_task_form_submission_id = taskFormSubmission.workflows_task_form_submission_id || 0;
        this.workflow_task_assignment_id = taskFormSubmission.workflow_task_assignment_id;
        this.form_id = taskFormSubmission.form_id;
        this.form_data = taskFormSubmission.form_data || {};
        this.form_submitted_by = taskFormSubmission.form_submitted_by || plainToken.user_id;
        this.form_submitted_on = taskFormSubmission.form_submitted_on || moment().toISOString();
        this.form_status = taskFormSubmission.form_status !== undefined ? taskFormSubmission.form_status : 1;
        this.created_by = taskFormSubmission.created_by || plainToken.user_id;
        this.updated_by = taskFormSubmission.updated_by || plainToken.user_id;
    }

    static validateFormSubmission = (taskFormSubmission: IWorkflowTaskFormSubmission): Joi.ValidationResult => {
        const formSubmissionSchema = Joi.object({
            workflows_task_form_submission_id: Joi.number().integer().optional(),
            workflow_task_assignment_id: Joi.number().integer().required(),
            form_id: Joi.number().integer().required(),
            form_data: Joi.object().allow(null).default({}),
            form_submitted_by: Joi.number().integer().optional(),
            form_submitted_on: Joi.string().allow("", null),
            form_status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return formSubmissionSchema.validate(taskFormSubmission);
    }
}

class WorkflowTransaction implements IWorkflowTransaction {
    workflow_transaction_id: number;
    transition_id: number;
    transaction_status: number;
    created_by: number;
    updated_by: number;

    constructor(transaction: IWorkflowTransaction, plainToken: PlainToken) {
        this.workflow_transaction_id = transaction.workflow_transaction_id || 0;
        this.transition_id = transaction.transition_id;
        this.transaction_status = transaction.transaction_status !== undefined ? transaction.transaction_status : 1;
        this.created_by = transaction.created_by || plainToken.user_id;
        this.updated_by = transaction.updated_by || plainToken.user_id;
    }

    static validateTransaction = (transaction: IWorkflowTransaction): Joi.ValidationResult => {
        const transactionSchema = Joi.object({
            workflow_transaction_id: Joi.number().integer().optional(),
            transition_id: Joi.number().integer().required(),
            transaction_status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return transactionSchema.validate(transaction);
    }
}

class Node implements INode {
    node_id: number;
    node_name: string;
    node_description: string;
    node_type: string;
    no_of_input_nodes: number;
    no_of_output_nodes: number;
    status: number;
    created_by: number;
    updated_by: number;

    constructor(node: INode, plainToken: PlainToken) {
        this.node_id = node.node_id;
        this.node_name = node.node_name;
        this.node_description = node.node_description;
        this.node_type = node.node_type;
        this.no_of_input_nodes = node.no_of_input_nodes;
        this.no_of_output_nodes = node.no_of_output_nodes;
        this.status = node.status || 1;
        this.created_by = plainToken.user_id;
        this.updated_by = plainToken.user_id;
    }

    static validateNode = (node: INode): Joi.ValidationResult => {
        const nodeSchema = Joi.object({
            node_id: Joi.number().integer().optional(),
            node_name: Joi.string().min(3).max(50).required().error(
                new Error(`${WORKFLOWS.WORKF0001}`)
            ),
            node_description: Joi.string().optional().allow(null).error(
                new Error(`${WORKFLOWS.WORKF0001}`)
            ),
            node_type: Joi.string().optional().allow(null).max(50),
            no_of_input_nodes: Joi.number().integer().optional().allow(null),
            no_of_output_nodes: Joi.number().integer().optional().allow(null),
            status: Joi.number().integer().default(1),
            created_by: Joi.number().integer().required(),
            updated_by: Joi.number().integer().required(),
        });
        return nodeSchema.validate(node);
    }
}

export {
    Workflow,
    WorkflowTask,
    WorkflowNotificationTask,
    WorkflowDecisionTask,
    WorkflowDecisionCondition,
    WorkflowTransition,
    WorkflowAssignment,
    WorkflowTaskAssignment,
    WorkflowTaskFormSubmission,
    WorkflowTransaction,
    Node
}