
export interface AuthTokenService {
    generateToken(payload: object): string; // <--- Cambia String a string
    verifyToken(token: string): any;
}