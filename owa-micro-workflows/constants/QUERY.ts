export const WORKFLOW = {
    createWorkflow: `INSERT INTO m_workflows (
    workflow_name, 
    workflow_description,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4) 
RETURNING workflow_id;`,
    createWorkflowtask: `INSERT INTO m_workflow_tasks (
    workflow_id, 
    node_id,
    task_name, 
    task_description, 
    form_id,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6, $7) 
RETURNING task_id;
`,
    ceateWorkflowNotificationTasks: `INSERT INTO m_workflow_notification_tasks (
    workflow_id, 
    node_id,
    notification_task_name, 
    notification_task_description, 
    notification_type, 
    email_subject, 
    email_body, 
    sms_body, 
    template_id, 
    placeholders, 
    recipient_emails, 
    recipient_mobilenumber,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
RETURNING notification_task_id;
`,
    createWorkflowDecisionTasks: `INSERT INTO m_workflow_decision_tasks (
    workflow_id, 
    node_id,
    decision_task_name, 
    decision_task_description,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING decision_task_id;
`,
    createWorkflowDecisionConditions: `INSERT INTO m_workflow_decision_conditions (
    decision_task_id, 
    operand_one, 
    operator, 
    operand_two,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING condition_id;
`,
    createWorkflowTransition: `INSERT INTO m_workflow_transition (
    from_task_id, 
    to_task_id,
    condition_type,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING transition_id;
`,
    createWorkflowsAssignment: `INSERT INTO tr_workflows_assignment (
    workflow_id, 
    workflow_triggered_on, 
    workflow_triggered_by,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING workflow_assignment_id;
`,
    createWorkflowTaskAssignment: `INSERT INTO tr_workflows_task_assignment (
    workflow_assignment_id, 
    task_id, 
    assigned_to, 
    assigned_on, 
    assigned_by, 
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6, $7) 
RETURNING workflow_task_assignment_id;
`,
    createwWrkflowsTaskFormSubmission: `INSERT INTO tr_workflows_task_form_submission (
    workflow_task_assignment_id, 
    form_id, 
    form_data, 
    form_submitted_by, 
    form_submitted_on,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6, $7) 
RETURNING workflows_task_form_submission_id;
`,
    createWorkflowTransaction: `INSERT INTO tr_workflow_transaction (
    transition_id,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3) 
RETURNING workflow_transaction_id;
`,
    createNode: `INSERT INTO m_nodes (
        node_name, 
        node_description, 
        node_type, 
        no_of_input_nodes, 
        no_of_output_nodes, 
        created_by, 
        updated_by
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING node_id;`
}
    