import express from "express";
import { Express } from "express";
import { configureRoutes } from "./routes";
import { defaultErrorHandler } from "./shared";

export const buildApp = (): Express => {
  const app = express();
  // Global Middleware
  app.use(express.json());

  // Configure Routes
  configureRoutes(app);

  // Global Error Handler
  app.use(defaultErrorHandler);

  return app;
} 
