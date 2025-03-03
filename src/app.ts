import express, { NextFunction, Request, Response } from "express";
import httpContext from "express-http-context";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import pinoHttp from "pino-http";
import LOGGER from "./config/logger";
import { GlobalConfig } from "./config/environment";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import router from "./routes";
import httpErrors, { HttpError } from "http-errors";
import { ZodError } from "zod";
import status from "http-status";
import { APIError } from "better-auth/api";

const app = express();

app.use(httpContext.middleware as unknown as express.RequestHandler);

app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 5000,
    filter: (req, res) =>
      req.headers["request-no-compression"]
        ? false
        : compression.filter(req, res),
  }),
);

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));

app.use(
  cors({
    credentials: true,
    origin: [GlobalConfig.FRONTEND_HOST!],
  }),
);

app.use(cookieParser(GlobalConfig.COOKIE_SECRET));

app.use(
  pinoHttp({
    logger: LOGGER,
    level: "info",
    serializers: {
      req: (req) => {
        if (GlobalConfig.ENVIRONMENT === "DEVELOPMENT") {
          return {
            method: req.method,
            url: req.url,
          };
        }
        return req;
      },
      res: (res) => {
        if (GlobalConfig.ENVIRONMENT === "DEVELOPMENT") {
          return {
            statusCode: res.statusCode,
          };
        }
        return res;
      },
    },
  }),
);

app.use("/v1/api", router);

app.use((req, _, next) => {
  next(httpErrors.NotFound(`Route not found for [${req.method}] ${req.url}`));
});

app.use(
  (
    err: Error | HttpError | ZodError | APIError,
    req: Request,
    res: Response,
    _: NextFunction,
  ) => {
    let responseStatus: number;
    let responseMessage:
      | string
      | { path: (string | number)[]; message: string }[];
    if (err instanceof ZodError) {
      responseMessage = err.errors.map((e) => {
        return { path: e.path, message: e.message };
      });
      responseStatus = status.UNPROCESSABLE_ENTITY;
    } else if (err instanceof HttpError) {
      responseMessage = err.message;
      responseStatus = err.status;
    } else if (err instanceof APIError) {
      responseMessage = err.message;
      responseStatus = status.UNPROCESSABLE_ENTITY;
    } else {
      responseMessage = `Cannot process req [${req.method}] ${req.url}`;
      responseStatus = status.INTERNAL_SERVER_ERROR;
    }

    res.status(responseStatus).json({
      error: {
        message: responseMessage,
      },
    });
  },
);

app.listen(GlobalConfig.PORT, () =>
  LOGGER.info(`Application running on port ${GlobalConfig.PORT}`),
);
