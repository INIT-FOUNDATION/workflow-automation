import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
    plainToken?: PlainToken;
}

interface PlainToken {
    user_id: number;
    role_id: number;
    email_id: string;
    mobile_number: number;
    user_name:string
}