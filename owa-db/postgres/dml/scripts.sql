-- Table: m_users
INSERT INTO m_users VALUES (1, '1234567890', 'Super Admin', NULL, NULL, 1234567890, null, 1, null, 1, '$2a$10$33gc5zgFfOOKt8Kr5wbPJOYCpq9jWrExEIbw3nw0CuQVf99pdJ0n6', NOW(), 0, 1, null, NOW(), NOW(), NOW(), null, null);

-- Table: m_roles
INSERT INTO m_roles VALUES (1, 'Super Admin', 'Role for Super Admin', 'Admin', 1, NOW(), NOW(), null, null);

-- Table: m_permissions
INSERT INTO m_permissions(permission_id, permission_name) VALUES (1, 'Write');
INSERT INTO m_permissions(permission_id, permission_name) VALUES (2, 'Read');

-- Table: m_menus
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (1, 'Admin Management', 'Menu for User Administration', 1, '/admin-management', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (2, 'Form Builder', 'Menu for Form Builder', 2, '/form-builder', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (3, 'Workflow Builder', 'Menu for Workflow Builder', 3, '/workflow-builder', 'fa fa-icon');
INSERT INTO m_menus(menu_id, menu_name, menu_description, menu_order, route_url, icon_class) VALUES (4, 'Workflow Assignment', 'Menu for Workflow Assignment', 4, '/workflow-assignment', 'fa fa-icon');


-- Table: m_fields
INSERT INTO m_fields (field_id, field_name, field_label, status, date_created, date_updated)
VALUES
    (1, 'input', 'Input', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'textArea', 'Text Area', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'radio', 'Radio', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'checkbox', 'Checkbox', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'dropdown', 'Dropdown', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Table: m_field_properties
INSERT INTO m_field_properties (field_id, field_property_name, field_property_type, field_property_label_display, options, description)
VALUES
    (1, 'type', 'select', 'Type', '[{"value": "text", "label": "Text"}, {"value": "email", "label": "Email"}, {"value": "number", "label": "Number"}, {"value": "password", "label": "Password"}]', 'Input type'),
    (1, 'name', 'text', 'Name', NULL, 'Field Name'),
    (1, 'label', 'text', 'Label', NULL, 'Field Label'),
    (1, 'placeholder', 'text', 'Placeholder', NULL, 'Field Placeholder'),
    (1, 'required', 'boolean', 'Required', NULL, 'Is this field required?'),
    (1, 'minlength', 'number', 'Minimum Length', NULL, 'Minimum length'),
    (1, 'maxlength', 'number', 'Maximum Length', NULL, 'Maximum length'),
    (2, 'required', 'boolean', 'Required', NULL, 'Is this field required?'),
    (2, 'minlength', 'number', 'Minimum Length', NULL, 'Minimum length'),
    (2, 'maxlength', 'number', 'Maximum Length', NULL, 'Maximum length'),
    (2, 'name', 'text', 'Name', NULL, 'Field Name'),
    (2, 'label', 'text', 'Label', NULL, 'Field Label'),
    (2, 'placeholder', 'text', 'Placeholder', NULL, 'Field Placeholder'),
    (3, 'required', 'boolean', 'Required', NULL, 'Is this field required?'),
    (3, 'name', 'text', 'Name', NULL, 'Field Name'),
    (3, 'value', 'text', 'Label', NULL, 'Field Label'),
    (3, 'label', 'text', 'Label', NULL, 'Field Label'),
    (4, 'required', 'boolean', 'Required', NULL, 'Is this field required?'),
    (4, 'name', 'text', 'Name', NULL, 'Field Name'),
    (4, 'value', 'text', 'Label', NULL, 'Field Label'),
    (4, 'label', 'text', 'Label', NULL, 'Field Label'),
    (5, 'required', 'boolean', 'Required', NULL, 'Is this field required?'),
    (5, 'name', 'text', 'Name', NULL, 'Field Name'),
    (5, 'options', 'json', 'Options', NULL, 'Options should be in Json format'),
    (5, 'label', 'text', 'Label', NULL, 'Field Label');