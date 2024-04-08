import { dbConnect } from "./config/Database";
import express, { Application } from "express";
import { mainApp } from "./mainApp";
import env from "dotenv";
env.config();

const port = parseInt(process.env.PORT!) || 3111;
const app: Application = express();

mainApp(app);

const server = app.listen(process.env.PORT! || port, () => {
  dbConnect();
}); 
process.on("uncaughtException", (error: Error | any) => {
  console.log("Error due to uncaughtException", error.message);
});

process.on("unhandledRejection", (reason:Error | any) => {
  server.close(() => {
    console.log("Error due to unhandledRejection", reason.message);
  });
});
