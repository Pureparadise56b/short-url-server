import { Request, Response, NextFunction } from "express";

const AsynHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));

export { AsynHandler };
