import { BooleanSchema } from "joi";
import mongoose from "mongoose";

interface iUser {
  name: string;
  email: string;
  verified: boolean;
  OTP: string;
  token: string;
}

interface iUserData extends iUser, mongoose.Document {}

const userSchema = new mongoose.Schema<iUserData>(
  {
    name: {
      type: String,
      required: [true, "You must input a name"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "You must input an email"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<iUserData>("users", userSchema);
export default User;
