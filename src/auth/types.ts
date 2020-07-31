import { Encoding } from "speakeasy";

export interface User {
    id: number;
    email: string;
    password: string;
}

export interface LoginDto { 
    email: string;
    password: string;
    secret: string;
    token: string;
}


export interface OtpUrlOptions { 
    secret: string; 
    issuer: string; 
    label?: string;
    encoding: Encoding;
}

export interface CustomQRCodeDto { 
    secret: string; 
    label?: string;
}
