export interface IWorkflow {
    workflow_id: number;
    workflow_name: string;
    workflow_description: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowNotificationTask {
    notification_task_id?: number;
    workflow_id: number;
    notification_task_name: string;
    notification_task_description: string;
    notification_type: string;
    email_subject?: string;
    email_body?: string;
    sms_body?: string;
    template_id?: string;
    placeholders?: object;
    recipient_emails?: string;
    recipient_mobilenumber?: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowDecisionTask {
    decision_task_id?: number;
    workflow_id: number;
    decision_task_name: string;
    decision_task_description: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowDecisionCondition {
    condition_id?: number;
    decision_task_id: number;
    operand_one: string;
    operator: string;
    operand_two: string;
    condition_type: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowTransition {
    transition_id?: number;
    from_task_id: number;
    to_task_id: number;
    from_task_type: string;
    to_task_type: string;
    condition_type: string;
    status?: number;
    date_created?: string;
    date_updated?: string;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowAssignment {
    workflow_assignment_id?: number;
    workflow_id: number;
    workflow_triggered_on?: string;
    workflow_triggered_by?: number;
    workflow_status?: number;
    date_created?: string;
    date_updated?: string;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTaskAssignment {
    workflow_task_assignment_id?: number;
    workflow_assignment_id: number;
    task_id: number;
    assigned_to?: number;
    assigned_on?: string;
    assigned_by?: number;
    task_status?: number;
    date_created?: string;
    date_updated?: string;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTaskFormSubmission {
    workflows_task_form_submission_id?: number;
    workflow_task_assignment_id: number;
    form_id: number;
    form_data?: object;
    form_submitted_by?: number;
    form_submitted_on?: string;
    form_status?: number;
    date_created?: string;
    date_updated?: string;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTransaction {
    workflow_transaction_id?: number;
    transition_id: number;
    transaction_status?: number;
    date_created?: string;
    date_updated?: string;
    created_by: number;
    updated_by: number;
}