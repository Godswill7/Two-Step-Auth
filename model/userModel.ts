import mongoose, { Schema, model } from "mongoose";
import { iUserData } from "../utils/Interface";

const userSchema = new Schema<iUserData>(
  {
    name: {
      type: String,
      required:true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required:true
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

const User =  model<iUserData>("users", userSchema);
export default User;
