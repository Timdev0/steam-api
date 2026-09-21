import type { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (req: Request, res: Response) => Promise<unknown>;

/**
 * Avoids duplicating a try/catch in every controller: any error (or
 * rejection) is forwarded to `next`, i.e. to the centralized error
 * middleware (see middleware/errorHandler.ts).
 */
export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}
