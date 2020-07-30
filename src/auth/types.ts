
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
