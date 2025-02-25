import { User } from "better-auth/types";
import { Request } from "express";

export interface IRequest extends Request {
  user?: User;
}
