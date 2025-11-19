//interfaz de tokens, pues jwt es uno de muchos modelos

export interface AuthTokenService{

    generateToken(payload: object): String; // ingresamos el payload, que puede ser un entidad, y nos devuelve el token con farmato xxx.yyy.zzz

    verifyToken(token: string): any; //verificamos el token y nos puede devolver cualquier entidad... Tiene sentido, creo.
}