export const WORKFLOW = {
    createWorkflow: `INSERT INTO m_workflows (
    workflow_name, 
    workflow_description,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4) 
RETURNING workflow_id;`,
    updateWorkflow: `UPDATE m_work,flows
	SET workflow_name=$2, workflow_description=$3, status=$4, date_updated=now(), updated_by=$5
	WHERE workflow_id = $1`,
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
    updateWorkflowTask: `UPDATE m_workflow_tasks
	SET workflow_id=$2, node_id=$3, task_name=$4, task_description=$5, form_id=$6, status=$7, date_updated=now(), updated_by=$8
	WHERE task_id=$1`,
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
    updateWorkflowNotificationTasks: `UPDATE m_workflow_notification_tasks
	SET workflow_id=$2, notification_task_name=$3, notification_task_description=$4, notification_type=$5,
     node_id=$6, email_subject=$7, email_body=$8, sms_body=$9, template_id=$10, placeholders=$11, recipient_emails=$12,
      recipient_mobilenumber=$13, status=$14, date_updated=now(), updated_by=$15
	WHERE notification_task_id=$1;`,
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
    updateWorkflowDecisionTasks: `UPDATE m_workflow_decision_tasks
	SET workflow_id=$2, node_id=$3, decision_task_name=$4, decision_task_description=$5, status=$6, date_updated=now(), updated_by=$7
	WHERE decision_task_id=$1;`,
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
    updateWorkflowDecisionConditions: `UPDATE m_workflow_decision_conditions
	SET decision_task_id=$2, operand_one=$3, operator=$4, operand_two=$5, status=$6, date_updated=now(), updated_by=$7
	WHERE condition_id=$1;`,
    createWorkflowTransition: `INSERT INTO m_workflow_transition (
    workflow_id,
    from_task_id, 
    to_task_id,
    condition_type,
    created_by, 
    updated_by
) 
VALUES ($1, $2, $3, $4, $5, $6) 
RETURNING transition_id;
`,
    deleteWorkflowTransition: `DELETE from m_workflow_transition where workflow_id = $1`,
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
        node_icon,
        node_type, 
        no_of_input_nodes, 
        no_of_output_nodes, 
        created_by, 
        updated_by
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
    RETURNING node_id;`,
    latestUpdatedCheck: `SELECT COUNT(*) as count FROM m_workflows WHERE date_updated >= NOW() - INTERVAL '5 minutes'`,
    workflowsTotalCount: `SELECT COUNT(*) as count FROM m_workflows WHERE 1=1`,
    listWorkflows: `SELECT workflow_id, workflow_name, workflow_description, status, created_by, updated_by FROM m_workflows WHERE 1=1`,
    listNodes: `SELECT node_id, node_name, node_description, node_icon, node_type, no_of_input_nodes, 
        no_of_output_nodes, status, created_by, updated_by FROM m_nodes WHERE 1=1`,
    getWorkflow: `SELECT workflow_id, workflow_name, workflow_description, status, created_by, updated_by FROM m_workflows WHERE workflow_id = $1`,
    getWorkflowTasks: `SELECT task_id, workflow_id, node_id, task_name, task_description, form_id, status
	FROM m_workflow_tasks WHERE workflow_id = $1`,
    getWorkflowNotificationTasks: `SELECT notification_task_id, workflow_id, 
    notification_task_name, notification_task_description, notification_type, node_id, 
    email_subject, email_body, sms_body, template_id, placeholders, recipient_emails, recipient_mobilenumber, status
	FROM m_workflow_notification_tasks WHERE workflow_id = $1`,
    getWorkflowDecisionTasks: `SELECT decision_task_id, workflow_id, node_id, decision_task_name, decision_task_description, status
	FROM m_workflow_decision_tasks WHERE workflow_id = $1`,
    getWorkflowDecisionCondition: `SELECT condition_id, decision_task_id, operand_one, operator, operand_two, status
	FROM m_workflow_decision_conditions WHERE decision_task_id = $1`,
    getWorkflowTransitions: `SELECT transition_id, from_task_id, to_task_id, condition_type, status, workflow_id
	FROM m_workflow_transition WHERE workflow_id = $1`,
}
