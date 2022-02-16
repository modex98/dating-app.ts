import { Request, Response, NextFunction } from "express";
import { Err, CustomError } from "../errors/index";
import { Error } from "mongoose";
import path from "path";
import fs from "fs/promises";
import { Mode } from "fs";
import { APP_PATH, JWT_SECRET } from "../config/config";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

type LogNatureType = "error" | "request";

class Middleware {
      constructor() {}

      isVerifyErrors(err: Error): err is VerifyErrors {
            return (
                  err instanceof jwt.JsonWebTokenError ||
                  err instanceof jwt.NotBeforeError ||
                  err instanceof jwt.TokenExpiredError
            );
      }

      async log(
            data: string,
            logNature: LogNatureType,
            mode: Mode = "a"
      ): Promise<void> {
            let filePath = path.resolve(APP_PATH, "logs", `${logNature}s.log`);

            let file_descriptor = await fs.open(filePath, mode);

            await fs.appendFile(filePath, data + ";\n", "utf8");

            await file_descriptor.close();
      }

      request = (req: Request, res: Response, next: NextFunction): void => {
            let data = `[${Date.now()}] ---> ${req.method}: ${
                  req.originalUrl
            } from ${req.ip}`;

            console.log(data);

            if (req.method == "POST") {
                  // req.body = cleanObj(req.body);
                  console.log("body ==> ", req.body);
            }

            this.log(data, "request");

            next();
      };

      auth = (req: Request, res: Response, next: NextFunction): void => {
            let authHeader = req.headers.authorization;

            let token =
                  authHeader &&
                  authHeader.startsWith("Bearer ") &&
                  authHeader.split(" ")[1];

            if (!token) Err.throw("UnauthorizedError", "Unauthenticated");

            jwt.verify(token, JWT_SECRET, (err, payload) => {
                  if (err) throw err;

                  req.user = payload;
                  next();
            });
      };

      notFound = (req: Request, res: Response, next: NextFunction): never => {
            Err.throw("NotFoundError", "Page not found", true);
      };

      errorHandler = (
            err: Error,
            req: Request,
            res: Response,
            next: NextFunction
      ): void => {
            this.log(err.toString(), "error");

            console.log({
                  name: err.name,
                  type: typeof err,
                  // code: err.code,
                  err,
            });

            let error = Err.create("CustomError");

            if (this.isVerifyErrors(err)) {
                  error = Err.throw("ForbiddenError");
            }

            if (err instanceof CustomError) {
                  error = err;
            }

            // if (err.code == 11000) {
            //       customErr.message = `Duplicate value for ${Object.keys(
            //             err.keyValue
            //       )} field`;
            //       customErr.statusCode = StatusCodes.BAD_REQUEST;
            // }

            if (err instanceof Error.ValidationError) {
                  error = Err.create(
                        "BadRequestError",
                        Object.values(err.errors)
                              .map((item) => item.message)
                              .join(", ")
                  );
            }

            if (err instanceof Error.CastError) {
                  error = Err.create(
                        "NotFoundError",
                        `No item found with id; ${
                              (err as Error.CastError).value
                        }`
                  );
            }

            res.status(error.status_code).json({ error: error.toObject() });
            return next();
      };
}

export default new Middleware();
