import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { GlobalConfig } from "../config/environment";
import { authSigninSchema, authSignUpSchema } from "../lib/validations/auth";
import status from "http-status";

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

  async authSignUp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authDetails = await authSignUpSchema.parseAsync(req.body);

      const { user, token } = await auth.api.signUpEmail({
        body: {
          name: authDetails.name,
          email: authDetails.email,
          password: authDetails.password,
        },
      });

      res.status(status.OK).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async authSignIn(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authDetails = await authSigninSchema.parseAsync(req.body);

      const { user, token } = await auth.api.signInEmail({
        body: {
          email: authDetails.email,
          password: authDetails.password,
        },
      });

      res.status(status.OK).json({ user, token });
    } catch (error) {
      next(error);
    }
  }
}
