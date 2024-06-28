export const FORMS = {
    listForms: `SELECT * FROM m_forms WHERE 1=1`,
    formsTotalCount: `SELECT COUNT(*) as count FROM m_forms WHERE 1=1`,
    latestUpdatedCheck: `SELECT COUNT(*) as count FROM m_forms WHERE date_updated >= NOW() - INTERVAL '5 minutes'`,
    formExistsByName: `SELECT COUNT(*) as count FROM m_forms WHERE lower(form_name) = $1`,
    createForm: `INSERT INTO m_forms(form_name, form_description, status, date_created, date_updated, created_by, updated_by)
	                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING form_id`,
    updateForm: `UPDATE m_forms SET form_name=$2, form_description=$3, status=$4, date_updated=$5, updated_by=$6
	                WHERE form_id=$1`,
    createFormFieldAssoc: `INSERT INTO m_form_fields_assoc(form_id, field_id, options, status, date_created, date_updated, created_by, updated_by)
	                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)  RETURNING form_field_assoc_id`,
    updateFormFieldsAssoc: `UPDATE m_form_fields_assoc SET options=$2, status=$3, date_updated=$4, updated_by=$5
	                            WHERE form_field_assoc_id = $1`,
    getFormById: `SELECT * FROM m_forms WHERE form_id = $1`,
    getFormFieldsByFormId: `SELECT * FROM m_form_fields_assoc WHERE form_id = $1`,
    getFormFieldPropertiesByFieldId: `SELECT * FROM m_field_properties WHERE field_id = $1`,
    getFormFieldsList: `SELECT * FROM m_fields`,
    updateFormStatus: `UPDATE m_forms SET status = $1, updated_by = $2, date_created = $3 WHERE form_id = $4`
}