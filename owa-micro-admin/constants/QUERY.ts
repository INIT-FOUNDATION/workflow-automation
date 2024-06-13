export const ROLES = {
    listRoles: 'SELECT role_id, role_name from m_roles WHERE status = 1 ORDER BY date_created DESC',
    addRole: 'INSERT INTO m_roles (role_name, role_description, created_by, updated_by) VALUES ($1, $2, $3, $4)',
    updateRole: 'UPDATE m_roles SET role_name = $2, role_description = $3, updated_by = $4, date_updated = NOW() WHERE role_id = $1',
    getRole: 'SELECT role_name, role_description, date_created, date_updated, created_by, updated_by FROM m_roles WHERE role_id = $1 AND status = 1',
    updateRoleStatus: 'UPDATE m_roles SET status = $2, updated_by = $3, date_updated = NOW() WHERE role_id = $1',
    getAccessListByRoleId: `SELECT mm.menu_id, 
                            mm.menu_name,
                            mm.route_url,
                            mm.icon_class,
                            sum(CASE WHEN (ac.per_id) = 1 THEN 1 ELSE 0 END) write_permission,
                            sum(CASE WHEN (ac.per_id) = 2 THEN 1 ELSE 0 END) read_permission,
                            (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 ELSE 0 END) display_permission
                        FROM m_menus mm 
                        LEFT OUTER JOIN access_control ac ON mm.menu_id = ac.menu_id AND ac.role_id=$1
                        LEFT OUTER JOIN m_permissions mp ON ac.per_id = mp.per_id
                        WHERE mm.is_active=1
                        GROUP BY mm.menu_id, mm.menu_name, mm.route_url, mm.icon_class, mm.menu_order
                        ORDER BY mm.menu_order ASC`,
    getMenusListByRoleId: `SELECT menu_id, menu_name AS label, route_url as link, icon_class as icon, status, 'true' as initiallyOpened from m_menus WHERE status = 1`,
    getCombinedAccessListByRoleId: `SELECT * FROM (
        SELECT M.menu_id, M.menu_name, M.route_url, M.icon_class,
            MD.module_id, MD.module_name, MD.module_icon, MD.module_route,MD.module_order, M.menu_order,
            SUM(CASE WHEN (ac.per_id) = 1 THEN 1 WHEN (uac.per_id) = 1 THEN 1 ELSE 0 END ) AS write_permission,
            SUM(CASE WHEN (ac.per_id) = 2 THEN 1 WHEN (uac.per_id) = 2 THEN 1 ELSE 0 END )  AS read_permission,
            (CASE WHEN sum(COALESCE(ac.per_id, 0)) > 0 THEN 1 WHEN sum(COALESCE(uac.per_id, 0)) > 0 THEN 1 ELSE 0 END) AS display_permission
        FROM m_menus M 
        LEFT JOIN m_modules MD ON MD.module_id = M.parent_menu_id 
        LEFT JOIN user_access_control UAC ON M.menu_id = UAC.menu_id AND UAC.user_id=$1
        LEFT JOIN access_control AC ON M.menu_id = AC.menu_id AND AC.role_id=$2
        LEFT JOIN m_permissions P ON AC.per_id = P.per_id
        LEFT JOIN m_permissions P2 ON UAC.per_id = P2.per_id
        WHERE M.is_active=1 
        GROUP BY M.menu_id, M.menu_name, M.route_url, M.icon_class, MD.module_id, 
        MD.module_name, MD.module_icon, MD.module_route, MD.module_order, M.menu_order
        ORDER BY MD.module_order, M.menu_order ASC
            ) T WHERE (write_permission =1 OR read_permission = 1 OR display_permission = 1)`,
    getDefaultAccessList: "SELECT menu_id, menu_name, route_url,icon_class, per_id, per_name FROM m_menus CROSS JOIN m_permissions WHERE is_active = 1 ORDER BY parent_menu_id, menu_id, per_id",
    existsByRoleId: `SELECT EXISTS (
                        SELECT 1
                            FROM m_roles
                            WHERE role_id = $1 AND status = 1
                    )`,
    existsByRoleName: `SELECT EXISTS (
                        SELECT 1
                            FROM m_roles
                            WHERE role_name = $1 AND status = 1
                    )`
}

export const USERS = {

}

export const DEPARTMENTS = {
    listDepartments: 'SELECT department_id, department_name FROM m_departments WHERE status = 1',
    addDepartment: `INSERT INTO m_departments (department_name) VALUES ($1)`,
    updateDepartment: `UPDATE m_departments SET department_name = $2, date_updated = NOW() WHERE department_id = $1`,
    getDepartment: `SELECT department_id, department_name from m_departments WHERE department_id = $1 AND status = 1`,
    updateDepartmentStatus: 'UPDATE m_departments SET status = $2, date_updated = NOW() WHERE department_id = $1',
    existsByDepartmentId: `SELECT EXISTS (
        SELECT 1
            FROM m_departments
            WHERE department_id = $1 AND status = 1
    )`,
    existsByDepartmentName: `SELECT EXISTS (
        SELECT 1
            FROM m_departments
            WHERE department_name = $1 AND status = 1
    )`
}