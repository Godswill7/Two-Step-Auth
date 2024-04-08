import mongoose, { Schema, model } from "mongoose";

interface iUser {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  OTP: string;
  token: string;
}

interface iUserData extends iUser, mongoose.Document {}

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
