import { RequestHandler } from "express";
import { DataService } from "../utility";

export type InjectedHandler = (service: DataService) => RequestHandler;
export type Handler = RequestHandler;
export * from "./Models";
export * from "./Types";
export * from "./ValidationError";