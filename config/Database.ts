import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongooseString: string = process.env.TWOSTEPAUTH_DB!;

export const dbConnect = async () => {
  try {
   await connect(mongooseString).then(() => {
      console.log("connected to our database");
    });
  } catch (error: any) {
    console.log("Error conecting db : ", error.message);
  }
};
