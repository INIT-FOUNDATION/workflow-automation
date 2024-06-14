
export const USER = {
    selectUserQuery:`SELECT u.user_id,ud.department_id, user_name, password, display_name, role_id, mobile_number, email_id 
	from m_users u left join m_user_department_assoc ud on u.user_id = ud.user_id
	WHERE user_name = $1`,
    selectRoleDetailsQueryByRoleId:`SELECT * FROM m_roles WHERE role_id = $1`,
    getInvalidAttempts:`SELECT invalid_attempts from m_users WHERE user_name = $1`,
    getMaxInvalidLoginAttempts:`SELECT max_invalid_attempts, password_expiry FROM password_complexity ORDER BY date_created DESC LIMIT 1`,
    incrementInvalidAttempts:`UPDATE m_users SET invalid_attempts = invalid_attempts + 1 WHERE user_name = $1`,
    setUserInactive:`UPDATE m_users SET account_locked = 1 WHERE user_name = $1`,
    updateUserLoggedInOut:`UPDATE m_users SET is_logged_in = $1, last_logged_in_out=NOW() WHERE user_name = $2`,
    resetPasswordQuery:`UPDATE m_users SET password = $1 WHERE mobile_number = $2`
}