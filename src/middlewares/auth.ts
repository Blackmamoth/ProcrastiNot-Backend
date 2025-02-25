import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { IRequest } from "../lib/types";
import type { Response, NextFunction } from "express";
import httpErrors from "http-errors";

export default class AuthMiddleware {
  async verifyBetterAuthToken(
    req: IRequest,
    _: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session?.session && session.user) {
        req.user = session.user;
      } else {
        throw httpErrors.Unauthorized("Unauthorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
