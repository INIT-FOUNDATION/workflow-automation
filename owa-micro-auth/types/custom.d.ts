export interface IUser {
    user_name: string;
    mobile_number: string;
    email_id: string;
    role_id: string;
    password: string;
    new_password: string;
    confirm_password: string;
    txnId: string,
    max_invalid_attempts: number,
    invalid_attempts: number,
    account_locked:number;
    password_last_updated: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}