export interface IRole {
    role_id: number;
    role_name: string;
    role_description: string;
    status: number;
    date_created: string | undefined;
    date_updated: string | undefined;
    created_by: number | undefined;
    updated_by: number | undefined;
}