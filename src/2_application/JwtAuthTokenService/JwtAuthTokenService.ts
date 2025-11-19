//implementación de nuestro AuthTokenService para jwt

import { AuthTokenService } from "../../1_domain/AuthTokenService/AuthTokenService.js";
import  jwt  from "jsonwebtoken";

//Estos métodos son sincrónicos, ver si esto afecta de alguna manera el proceso que usamos.

export class JwtAuthTokenService implements AuthTokenService{
    //el secret es una palabra que codifica nuestro token... No puedo decir más por el secreto.
    constructor(private readonly secret: string) {}

    generateToken(payload: object): String {
        //devuelve el token, necesita el objeto, usa el secreto y le damos un tiempo de expiración
        return jwt.sign(payload, this.secret, {expiresIn: "1h"});
    }

    verifyToken(token: string): any {
        return jwt.verify(token, this.secret);
    }
}