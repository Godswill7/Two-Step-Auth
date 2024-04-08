import { Document } from "mongoose";

export enum HTTP {
  CREATE = 201,
  BAD = 400,
  UPDATE = 202,
  DELETE = 204,
  OK = 200,
}

export interface iError {
  name: string;
  message: string;
  success: boolean;
  status: HTTP;
}

interface iUser {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  OTP: string;
  token: string;
}

export interface iUserData extends iUser, Document {}