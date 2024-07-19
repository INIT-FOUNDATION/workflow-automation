import Joi from "joi";
import {
    IWorkflowAssignment, IWorkflowTaskAssignment, IWorkflowTaskFormSubmission,
    IWorkflowTransaction, INode
} from "../types/custom";
import moment from "moment";
import { PlainToken } from "../types/express";

class WorkflowAssignment implements IWorkflowAssignment {
    workflow_assignment_id: number;
    workflow_id: number;
    workflow_triggered_by: number;
    workflow_status: number;
    created_by: number;
    updated_by: number;

    constructor(assignment: IWorkflowAssignment, plainToken: PlainToken) {
        this.workflow_assignment_id = assignment.workflow_assignment_id
        this.workflow_id = assignment.workflow_id;
        this.workflow_triggered_by = assignment.workflow_triggered_by || plainToken.user_id;
        this.workflow_status = assignment.workflow_status !== undefined ? assignment.workflow_status : 1;
        this.created_by = assignment.created_by || plainToken.user_id;
        this.updated_by = assignment.updated_by || plainToken.user_id;
    }

    static validateAssignment = (assignment: IWorkflowAssignment): Joi.ValidationResult => {
        const assignmentSchema = Joi.object({
            workflow_assignment_id: Joi.number().integer().optional(),
            workflow_id: Joi.number().integer().required(),
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
    deadline_on: string;
    assigned_by: number;
    task_status: number;
    created_by: number;
    updated_by: number;

    constructor(assignment: IWorkflowTaskAssignment, plainToken: PlainToken) {
        this.workflow_task_assignment_id = assignment.workflow_task_assignment_id
        this.workflow_assignment_id = assignment.workflow_assignment_id;
        this.task_id = assignment.task_id;
        this.assigned_to = assignment.assigned_to;
        this.deadline_on = assignment.deadline_on;
        this.assigned_by = assignment.assigned_by || plainToken.user_id;
        this.task_status = assignment.task_status !== undefined ? assignment.task_status : 1;
        this.created_by = assignment.created_by || plainToken.user_id;
        this.updated_by = assignment.updated_by || plainToken.user_id;
    }

    static validateAssignment = (assignment: IWorkflowTaskAssignment): Joi.ValidationResult => {
        const assignmentSchema = Joi.object({
            workflow_task_assignment_id: Joi.number().integer().optional(),
            workflow_assignment_id: Joi.number().integer().optional(),
            task_id: Joi.number().integer().required(),
            assigned_to: Joi.number().integer().optional(),
            deadline_on: Joi.string().required(),
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
        this.workflows_task_form_submission_id = taskFormSubmission.workflows_task_form_submission_id
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
        this.workflow_transaction_id = transaction.workflow_transaction_id
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

export {
    WorkflowAssignment,
    WorkflowTaskAssignment,
    WorkflowTaskFormSubmission,
    WorkflowTransaction
}