DROP VIEW IF EXISTS vw_m_users;

CREATE OR REPLACE VIEW public.vw_m_users AS
SELECT
    u.user_id,
    u.user_name,
    u.first_name,
    u.last_name,
    u.mobile_number,
    u.email_id,
    u.gender,
    TO_CHAR(u.dob, 'DD/MM/YYYY') AS dob,
    u.role_id,
    u.date_created,
    u.date_updated,
    u.status,
    u.display_name,
    TO_CHAR(
        u.last_logged_in + INTERVAL '5 hours 30 minutes',
        'DD-MON-YYYY HH12:MI PM'
    ) AS last_logged_in_out,
    r.role_name,
    r.level AS level,
    u.profile_pic_url,
    d.department_name,
    ARRAY_AGG(ura.reporting_to) AS reporting_to_users
FROM
    m_users u
    LEFT JOIN m_roles r ON u.role_id = r.role_id
    LEFT JOIN m_user_department_assoc uda ON u.user_id = uda.user_id
    LEFT JOIN m_departments d ON uda.department_id = d.department_id
    LEFT JOIN m_user_reporting_assoc ura ON u.user_id = ura.user_id
GROUP BY
    u.user_id,
    u.user_name,
    u.first_name,
    u.last_name,
    u.mobile_number,
    u.email_id,
    u.gender,
    u.dob,
    u.role_id,
    u.date_created,
    u.date_updated,
    u.status,
    u.display_name,
    u.last_logged_in,
    r.role_name,
    r.level,
    u.profile_pic_url,
    d.department_name;