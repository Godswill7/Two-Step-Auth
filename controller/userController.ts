import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../utils/Email";
import { HTTP } from "../utils/Interface";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const Salt = await bcrypt.genSalt(5);
    const encrypt = await bcrypt.hash(password, Salt);

    const OtpCode = crypto.randomBytes(2).toString("hex");
    const tokenValue = crypto.randomBytes(5).toString("hex");
    const tokenCode = jwt.sign(tokenValue, "code");

    const user = await User.create({
      name,
      email,
      password: encrypt,
      OTP: OtpCode,
      token: tokenCode,
    });
    sendMail(user).then(() => {
      console.log("Mail sent ..");
    });
    

    return res.status(HTTP.CREATE).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(HTTP.BAD).json({
      message: error.message,
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const pass = await bcrypt.compare(password, user?.password);
      if (pass) {
        if (user?.verified === true && user?.token === "") {
          const ID = jwt.sign({ id: user._id }, "code");
          return res.status(HTTP.OK).json({
            message: `Welcome Back ${user?.name}`,
            data: ID,
          });
        } else {
          return res.status(HTTP.BAD).json({
            message: "Go and verify ur account",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          message: "Incorrect password",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "user not found",
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(HTTP.BAD).json({
      message: "error signing in",
      data: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const ID: any = jwt.verify(token, "code", (err: any, payload: any) => {
      if (err) {
        return err;
      } else {
        return payload.id;
      }
    });

    const user: any = await User.findByIdAndUpdate(
      ID,
      {
        token: "",
        verified: true,
      },
      {
        new: true,
      }
    );

    return res.status(HTTP.OK).json({
      message: "ur acct has been verified",
      data: user,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(HTTP.BAD).json({
      message: "error verifying user",
      data: error.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await User.findById(userID);

    return res.status(HTTP.OK).json({
      message: "User gotten",
      data: user?.id,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "error getting one user",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const user = await User.find();

    return res.status(HTTP.OK).json({
      message: "All User gotten",
      data: user,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "error getting all user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    await User.findByIdAndDelete(userID);

    return res.status(HTTP.DELETE).json({
      message: "User deleted",
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "error deleting user",
    });
  }
};
