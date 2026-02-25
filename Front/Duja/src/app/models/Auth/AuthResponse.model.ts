export interface IAuthResponse {
    token: string;
    userId: string;
    userName: string;
    email: string;
    roles: string[];
    message: string;
}
