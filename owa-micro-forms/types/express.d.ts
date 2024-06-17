import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
    plainToken?: PlainToken;
}

interface PlainToken {
    user_id: number;
    role_id: number;
    email_id: number;
}


declare module 'express-serve-static-core' {
    interface Request {
      plainToken?: PlainToken;
    }
  }