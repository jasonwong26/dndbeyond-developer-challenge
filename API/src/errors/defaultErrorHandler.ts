import { Request, Response } from "express";
import { ApiResponse } from "../shared";

export const defaultErrorHandler = (error: Error, _: Request, response: Response): void => {
  const code = 500;
  const message = error.message || "Something went wrong...";

  const output: ApiResponse = {
    message
  };

  response
    .status(code)
    .json({ output });
}
