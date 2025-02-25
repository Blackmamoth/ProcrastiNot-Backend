import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { GlobalConfig } from "../config/environment";

export default class AuthController {
  async oauthSignin(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = await auth.api.signInSocial({
        body: {
          provider: "google",
          callbackURL: GlobalConfig.FRONTEND_HOST,
        },
      });
      res.json({ response });
    } catch (error) {
      next(error);
    }
  }
}
