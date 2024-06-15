export const USERS = {
    getLoggedInUserInfo: `SELECT U.user_id AS user_id,
                        U.user_name AS user_name,
                        TO_CHAR(U.dob, 'DD/MM/YYYY') AS dob,
                        U.gender AS gender,
                        U.email_id AS email_id,
                        U.first_name AS first_name,
                        U.last_name AS last_name,
                        U.mobile_number AS mobile_number,
                        U.display_name AS display_name,
                        R.role_id AS role_id,
                        R.role_name AS role_name, 
                        U.profile_pic_url,
                        D.department_id,
                        D.department_name
                    FROM m_users U 
                    LEFT OUTER JOIN m_user_department_assoc UDA ON U.user_id = UDA.user_id
                    LEFT OUTER JOIN m_departments D ON UDA.department_id = D.department_id
                    LEFT OUTER JOIN m_roles R ON U.role_id = R.role_id
                    WHERE U.user_name= $1 AND U.status=1`
}