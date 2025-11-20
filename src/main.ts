// src/main.ts

// 1. CARGAR VARIABLES DE ENTORNO PRIMERO
// Es vital hacerlo antes de importar archivos que usen process.env
import dotenv from 'dotenv'; 
dotenv.config(); 

import express from "express";
import cors from 'cors';

// 2. IMPORTAR INFRAESTRUCTURA
import { connectDB } from "./3_infraestructure/conection/Conection.js"; 
import { corsOptions } from './3_infraestructure/config/cors.config.js';

// 3. IMPORTAR RUTAS (Capa de Presentación)
import UserRoutes from './4_presentation/Users/UserRoutes.js';
import BudgetRoutes from './4_presentation/Budget/BudgetRoutes.js';
import ProfileRoutes from './/4_presentation/Profiles/ProfilesRoutes.js'; 


const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARES ---

// Usamos nuestro Bouncer (CORS configurado)
app.use(cors(corsOptions)); 

// Parseo de JSON para entender los req.body
app.use(express.json());


// --- RUTAS DE LA API ---
app.use('/users', UserRoutes);
app.use('/budgets', BudgetRoutes);
app.use('/profiles', ProfileRoutes); 


// --- RUTA DE SALUD (Health Check) ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hx-EquiFin API is running!',
    timestamp: new Date().toISOString()
  });
});

// --- INICIO DEL SERVIDOR ---
// Primero conectamos a BD, luego escuchamos
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n ¡Despegue exitoso!`);
    console.log(`  (Backend) lista en: http://localhost:${PORT}`);
    console.log(` saludable check: http://localhost:${PORT}/health`);
  });
});