/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

export const handleErrors =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      res
        .status(500)
        .json({ errors: { message: "Ocorreu um erro no servidor" } });
    }
  };

export function parseResponse(res: Response, status: number, result: any) {
  if (result.errors) {
    res.status(400).json(result);
  } else {
    res.status(status).json(result);
  }
}

export function errorMessage(message: string) {
  return { errors: { message } };
}
