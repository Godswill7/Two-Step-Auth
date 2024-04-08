import { NextFunction, Request, Response } from "express";
import {mainError } from "./mainError";
import { HTTP } from "../utils/Interface";

const errFile = (err: mainError, res: Response) => {
  res.status(HTTP.BAD).json({
    name: err.name,
    message: err.message,
    status: err.status,
    success: err.success,
    stack: err.stack,
  });
};

export const errorHandler = (
  err: mainError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  errFile(err, res);
};
