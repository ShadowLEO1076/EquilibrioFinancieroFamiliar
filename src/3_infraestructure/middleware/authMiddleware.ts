// infrastructure/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { JwtAuthTokenService } from "../../2_application/JwtAuthTokenService/JwtAuthTokenService.js";

import dotenv from 'dotenv';
dotenv.config();

const tokenService = new JwtAuthTokenService(process.env.SECRET_JWT!);


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const payload = tokenService.verifyToken(token);

    if (!payload || typeof payload !== "object") {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    (req as any).user = payload;
    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

