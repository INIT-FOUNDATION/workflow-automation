-- Table: m_users
CREATE TABLE m_users (
    user_id serial PRIMARY KEY,
    user_name VARCHAR(50),
    display_name VARCHAR(50),
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    mobile_number BIGINT,
    email_id VARCHAR(50),
    gender SMALLINT,
    dob DATE,
    role_id INT,
    password VARCHAR(100),
    password_last_updated TIMESTAMP DEFAULT now(),
    invalid_attempts INT DEFAULT 0,
    status smallint DEFAULT 1,
    profile_pic_url VARCHAR(100),
    last_logged_in TIMESTAMP DEFAULT now(),
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_roles
CREATE TABLE m_roles (
    role_id serial PRIMARY KEY,
    role_name VARCHAR(30),
    role_description VARCHAR(50),
    level VARCHAR(20),
    status smallint DEFAULT 1,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_department
CREATE TABLE m_departments (
    department_id serial PRIMARY KEY,
    department_name VARCHAR(50),
    status smallint DEFAULT 1,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: m_menus
CREATE TABLE m_menus (
    menu_id serial PRIMARY KEY,
    menu_name VARCHAR(30),
    menu_description VARCHAR(50),
    status smallint DEFAULT 1,
    parent_menu_id INT,
    menu_order INT,
    route_url VARCHAR(30),
    icon_class VARCHAR(30),
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: m_user_department_assoc
CREATE TABLE m_user_department_assoc (
    user_id INT,
    department_id INT,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: m_user_reporting_assoc
CREATE TABLE m_user_reporting_assoc (
    user_id INT,
    reporting_to INT,
    status INT DEFAULT 1,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: password_policies
CREATE TABLE password_policies (
    id serial PRIMARY KEY,
    password_expiry SMALLINT,
    password_history SMALLINT,
    minimum_password_length SMALLINT,
    complexity SMALLINT,
    alphabetical SMALLINT,
    numeric SMALLINT,
    special_characters SMALLINT,
    allowed_special_characters VARCHAR(50),
    maximum_invalid_attempts INT,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);

-- Table: access_control
CREATE TABLE access_control (
    role_id INT,
    menu_id INT,
    permission_id INT,
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now(),
    created_by INT,
    updated_by INT
);

-- Table: m_permissions
CREATE TABLE m_permissions (
    permission_id serial PRIMARY KEY,
    permission_name VARCHAR(30)
);

-- Table: app_version
CREATE TABLE app_version (
    app_id serial PRIMARY KEY,
    app_version VARCHAR(10),
    apk_version VARCHAR(10),
    apk_link VARCHAR(100),
    ios_version VARCHAR(10),
    ios_link VARCHAR(100),
    force_update SMALLINT,
    remarks VARCHAR(100),
    status smallint DEFAULT 1,
    release_date TIMESTAMP DEFAULT now(),
    date_created TIMESTAMP DEFAULT now(),
    date_updated TIMESTAMP DEFAULT now()
);


-- Table: m_forms
CREATE TABLE m_forms (
    form_id SERIAL PRIMARY KEY,
    form_name VARCHAR(50) NOT NULL,
    form_description TEXT,
    status INT NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT NOT NULL
);


-- Table: m_fields
CREATE TABLE m_fields (
    field_id SERIAL PRIMARY KEY,
    field_name VARCHAR(50) NOT NULL,
    field_label VARCHAR(50) NOT NULL,
    status INT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_field_properties
CREATE TABLE m_field_properties (
    field_property_id SERIAL PRIMARY KEY,
    field_id INT NOT NULL,
    field_property_name VARCHAR(50) NOT NULL,
    field_property_type VARCHAR(50) NOT NULL,
    field_property_label_display VARCHAR(50) NOT NULL,
    options JSON,
    description TEXT,
    status INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_form_fields_assoc
CREATE TABLE m_form_fields_assoc (
    form_field_assoc_id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    field_id INT NOT NULL,
    options JSON,
    status INT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_workflows
CREATE TABLE m_workflows (
    workflow_id SERIAL PRIMARY KEY,
    workflow_name VARCHAR(50) NOT NULL,
    workflow_description TEXT,
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

CREATE SEQUENCE workflow_tasks_sequence START WITH 100 INCREMENT BY 3;

-- Table: m_workflow_tasks
CREATE TABLE m_workflow_tasks (
    task_id INT PRIMARY KEY DEFAULT nextval('workflow_tasks_sequence'),
    workflow_id INT NOT NULL,
    node_id INT NOT NULL,
    task_name VARCHAR(50) NOT NULL,
    task_description TEXT,
    form_id INT NOT NULL,
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

CREATE SEQUENCE workflow_notification_tasks_sequence START WITH 101 INCREMENT BY 3;

-- Table: m_workflow_notification_tasks
CREATE TABLE m_workflow_notification_tasks (
    notification_task_id INT PRIMARY KEY DEFAULT nextval('workflow_notification_tasks_sequence'),
    workflow_id INT NOT NULL,
    notification_task_name VARCHAR(50) NOT NULL,
    notification_task_description TEXT,
    notification_type VARCHAR(50) CHECK (notification_type IN ('SMS', 'WHATSAPP', 'EMAIL')),
    node_id INT NOT NULL,
    email_subject TEXT,
    email_body TEXT,
    sms_body TEXT,
    template_id VARCHAR(50),
    placeholders JSON,
    recipient_emails VARCHAR(200),
    recipient_mobilenumber VARCHAR(200),
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

CREATE SEQUENCE workflow_decision_tasks_sequence START WITH 102 INCREMENT BY 3;

-- Table: m_workflow_decision_tasks
CREATE TABLE m_workflow_decision_tasks (
    decision_task_id INT PRIMARY KEY DEFAULT nextval('workflow_decision_tasks_sequence'),
    workflow_id INT NOT NULL,
    node_id INT NOT NULL,
    decision_task_name VARCHAR(50) NOT NULL,
    decision_task_description TEXT,
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_workflow_decision_conditions
CREATE TABLE m_workflow_decision_conditions (
    condition_id SERIAL PRIMARY KEY,
    decision_task_id INT NOT NULL,
    operand_one VARCHAR(50),
    operator VARCHAR(3),
    operand_two VARCHAR(50),
    condition_type VARCHAR(20) CHECK (condition_type IN ('MATCHED', 'NOT-MATCHED')),
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_workflow_transition
CREATE TABLE m_workflow_transition (
    transition_id SERIAL PRIMARY KEY,
    from_task_id INT NOT NULL,
    workflow_id INT NOT NULL,
    to_task_id INT NOT NULL,
    condition_type VARCHAR(20) CHECK (condition_type IN ('MATCHED', 'NOT-MATCHED')),
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: tr_workflows_assignment
CREATE TABLE tr_workflows_assignment (
    workflow_assignment_id SERIAL PRIMARY KEY,
    workflow_id INT NOT NULL,
    workflow_triggered_on TIMESTAMP,
    workflow_triggered_by INT,
    workflow_status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: tr_workflows_task_assignment
CREATE TABLE tr_workflows_task_assignment (
    workflow_task_assignment_id SERIAL PRIMARY KEY,
    workflow_assignment_id INT NOT NULL,
    task_id INT NOT NULL,
    assigned_to INT,
    assigned_on TIMESTAMP,
    assigned_by INT,
    task_status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: tr_workflows_task_form_submission
CREATE TABLE tr_workflows_task_form_submission (
    workflows_task_form_submission_id SERIAL PRIMARY KEY,
    workflow_task_assignment_id INT NOT NULL,
    form_id INT NOT NULL,
    form_data JSON,
    form_submitted_by INT,
    form_submitted_on TIMESTAMP,
    form_status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: tr_workflow_transaction
CREATE TABLE tr_workflow_transaction (
    workflow_transaction_id SERIAL PRIMARY KEY,
    transition_id INT NOT NULL,
    transaction_status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);

-- Table: m_nodes
CREATE TABLE m_nodes (
    node_id SERIAL PRIMARY KEY,
    node_name VARCHAR(50) NOT NULL,
    node_description TEXT,
    node_type VARCHAR(50),
    no_of_input_nodes INT,
    no_of_output_nodes INT,
    status SMALLINT DEFAULT 1,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT
);