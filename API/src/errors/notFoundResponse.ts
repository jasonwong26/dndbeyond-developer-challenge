import {Response} from "express";
import * as Types from "../shared";

export const respondNotFound = (response: Response): void => {
  const output: Types.ApiResponse = {
    message: "not found"
  }
  response.status(404).json(output);
}