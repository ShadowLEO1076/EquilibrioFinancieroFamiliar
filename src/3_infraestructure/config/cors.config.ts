// src/3_infrastructure/config/cors.config.ts

import cors from 'cors';
import dotenv from 'dotenv';

// ¡Cargamos las variables de entorno!
// (Asegúrate de que dotenv.config() también se llame en main.ts
// por si acaso, o llámalo solo en main.ts antes de importar esto)
// Por seguridad, lo llamamos aquí también.
dotenv.config();

// 1. Definimos tu "Lista de Invitados" (Whitelist)
const allowedOrigins = [
  process.env.CORS_ORIGIN_DEV_1, // -> http://localhost:3000
  process.env.CORS_ORIGIN_DEV_2, // -> http://192.168.100.22:3000
  process.env.CORS_ORIGIN_DEV_3, // -> http://192.168.56.1:3000
  process.env.CORS_ORIGIN_DEV_4, // ->  https://jolyn-uninterpretable-superperfectly.ngrok-free.dev 
  process.env.CORS_ORIGIN_PROD   // -> http://192.168.100.22:3000/test-api
];

// 2. Configuramos las reglas del Bouncer
// ¡¡Y la EXPORTAMOS!!
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 'origin' es la URL de QUIÉN te está llamando

    // Si la URL que llama ESTÁ en nuestra lista (o si no hay origen, como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      // ¡Lo dejamos pasar!
      callback(null, true);
    } else {
      // ¡No está en la lista! ¡Rechazado!
      callback(new Error('¡Alto ahí! No estás en la lista VIP de CORS. '));
    }
  },
  credentials: true // ¡SÚPER IMPORTANTE! Para que nos deje enviar cookies (el JWT)
};