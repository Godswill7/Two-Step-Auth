import cors from "cors";
import { Application, NextFunction, Request, Response, json } from "express";
import user from "./router/userRouter";
import morgan from "morgan";
import helmet from "helmet";
import { HTTP } from "./utils/Interface";
import { mainError } from "./Error/mainError";
import { errorHandler } from "./Error/errorHandler";

export const mainApp = (app: Application) => {
  app.use(json());
  app.use(cors({
    allowedHeaders: 'Content-Type',
    methods:["POST", "GET", "DELETE", "PATCH"]
  }));
  app.use(morgan("dev"));
  app.use(helmet());
  app.set("view engine", "ejs");

  app.use("/api", user);

  app.get("/", (req: Request, res: Response):any => {
    try {
      return res.status(HTTP.OK).json({
        message: "Welcome Home",
      });
    } catch (error: any) {
      console.error("An error occurred in the root route:", error);
      return res.status(HTTP.BAD).json({
        message: "Root Error",
        data: error.message,
      });
    }
  });

  app.use((error: Error, req: Request, res: Response) => {
    console.error("An error occurred:", error);
    res.status(HTTP.BAD).json({
      message: error.message || "An unexpected error occurred. Please try again later.",
    });
  });

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const routeError = new mainError({
      name: "This is an Invalid Route",
      status: HTTP.BAD,
      success: false,
      message: `You are seeing this message because the requested route: ${req.originalUrl} is invalid`,
    });
    next(routeError);
  });
  app.use(errorHandler);
};
