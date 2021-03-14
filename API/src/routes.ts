import { Express } from "express";
import { InMemoryDataService } from "./utility";
import { buildRouter } from "./characters";
import { notFound } from "./errors";

const storageService = new InMemoryDataService();
const characterRouter = buildRouter(storageService);

export const configureRoutes = (app: Express): void => {
  app.use("/characters", characterRouter);
  app.use(notFound);
}