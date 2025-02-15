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
    created_by INT NOT NULL,
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