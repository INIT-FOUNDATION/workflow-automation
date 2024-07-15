export interface IWorkflow {
    workflow_id: number;
    workflow_name: string;
    workflow_description: string;
    status: number;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowTask {
    task_id: number;
    workflow_id: number;
    node_id: number;
    node_type: string;
    is_new: boolean;
    task_name: string;
    task_description: string;
    form_id: number;
    status: number;
    x_axis: string;
    y_axis: string;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowNotificationTask {
    notification_task_id: number;
    workflow_id: number;
    node_id: number;
    node_type: string;
    is_new: boolean;
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
    x_axis: string;
    y_axis: string;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowDecisionTask {
    decision_task_id: number;
    workflow_id: number;
    node_id: number;
    node_type: string;
    is_new: boolean;
    conditions: IWorkflowDecisionCondition[];
    decision_task_name: string;
    decision_task_description: string;
    status: number;
    x_axis: string;
    y_axis: string;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowDecisionCondition {
    condition_id: number;
    decision_task_id: number;
    is_new: boolean;
    operand_one: string;
    operator: string;
    operand_two: string;
    status: number;
    created_by: number | undefined;
    updated_by: number | undefined;
}

export interface IWorkflowTransition {
    transition_id: number;
    workflow_id: number;
    from_task_id: number;
    to_task_id: number;
    condition_type: string;
    status: number;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowAssignment {
    workflow_assignment_id: number;
    workflow_id: number;
    workflow_triggered_on: string;
    workflow_triggered_by: number;
    workflow_status: number;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTaskAssignment {
    workflow_task_assignment_id: number;
    workflow_assignment_id: number;
    task_id: number;
    assigned_to: number;
    assigned_on: string;
    assigned_by: number;
    task_status: number;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTaskFormSubmission {
    workflows_task_form_submission_id: number;
    workflow_task_assignment_id: number;
    form_id: number;
    form_data: object;
    form_submitted_by: number;
    form_submitted_on: string;
    form_status: number;
    created_by: number;
    updated_by: number;
}

export interface IWorkflowTransaction {
    workflow_transaction_id: number;
    transition_id: number;
    transaction_status: number;
    created_by: number;
    updated_by: number;
}

export interface INode {
    node_id: number;
    node_name: string;
    node_description: string;
    node_icon: string;
    node_type: string;
    no_of_input_nodes: number;
    no_of_output_nodes: number;
    status: number;
    created_by: number;
    updated_by: number;
}