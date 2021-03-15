import {Response} from "express";
import * as Types from "../types";

export const respondNoContent = (response: Response): void => {
  const output: Types.ApiResponse = {
    message: "No Content"
  }
  response.status(204).json(output);
}