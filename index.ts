import { dbConnect } from "./config/Database";
import express, { Application } from "express";
import env from "dotenv";
import { mainApp } from "./mainApp";
env.config();

const port: number = parseInt(process.env.PORT!);
const app: Application = express();

const server = app.listen(process.env.PORT || port, () => {
  console.log();
  dbConnect();
});
mainApp(app);
process.on("uncaughtException", (error: Error | any) => {
  console.log("Error due to uncaughtException", error);
});

process.on("unhandledRejection", (reason: Error | any) => {
  server.close(() => {
    console.log("Error due to unhandledRejection", reason);
  });
});
