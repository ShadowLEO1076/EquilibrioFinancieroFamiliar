// src/main.ts

import express from "express";
import cors from 'cors';
import dotenv from 'dotenv'; // <-- ¡AÑADIDO! Para leer el .env
import { connectDB } from "./3_infraestructure/conection/Conection.js"; 

// --- ¡CAMBIO #1: IMPORTA NUESTRO Bouncer! ---
// ¡Importamos las opciones que creamos en la capa de infra!
import { corsOptions } from './3_infraestructure/config/cors.config.js';

// --- Tus rutas (¡perfecto!) ---
import UserRoutes from './4_presentation/Users/UserRoutes.js'
import BudgetRoutes from './4_presentation/Budget/BudgetRoutes.js'
// ... aquí importarás Income, Expense, etc. ...

// --- ¡CAMBIO #2: Cargar las variables de entorno! ---
// ¡Debe ir ANTES de que 'corsOptions' las necesite!
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---

// --- ¡CAMBIO #3: USA NUESTRO Bouncer! ---
// ¡En lugar del cors() por defecto, le pasamos nuestras reglas!
app.use(cors(corsOptions)); 

app.use(express.json());


// --- Tus rutas (¡perfecto!) ---
app.use('/users', UserRoutes);
app.use('/budgets', BudgetRoutes);
// ... aquí usarás las otras rutas ...

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Hx-EquiFin API is running!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`¡Cocina (Backend) lista en http://localhost:${PORT}! 🍳`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
});