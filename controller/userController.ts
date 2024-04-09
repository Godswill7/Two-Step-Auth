import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail, sendForgotPassword } from "../utils/Email";
import { HTTP } from "../utils/Interface";
import env from "dotenv";
env.config();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const Salt = await bcrypt.genSalt(5);
    const encrypt = await bcrypt.hash(password, Salt);

    const OtpCode = crypto.randomBytes(2).toString("hex");

    const user: any = await User.create({
      name,
      email,
      OTP: OtpCode,
      password: encrypt,
      // token: tokenCode,
    });
    const tokenCode = jwt.sign({ id: user.id }, process.env.SECRET!);

    sendMail(tokenCode).then(() => {
      console.log("Mail sent ..");
    });

    return res.status(HTTP.CREATE).json({
      message: "User created successfully",
      data: user && tokenCode,
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

    if (!user) {
      return res.status(HTTP.BAD).json({
        message: "User does not exist",
        status: HTTP.BAD,
      });
    }

    if (!user.verified && user.token !== "") {
      return res.status(HTTP.BAD).json({
        message: "Account Not Verified",
        status: HTTP.BAD,
      });
    }
    const pass = await bcrypt.compare(password, user?.password);

    if (!pass) {
      return res.status(HTTP.BAD).json({
        message: "Incorrect password",
        status: HTTP.BAD,
      });
    }
    const ID = jwt.sign({ id: user._id }, process.env.SECRET!);
    return res.status(HTTP.OK).json({
      message: `Welcome Back ${user?.name}`,
      data: ID,
    });
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

    const ID: any = jwt.verify(
      token,
      process.env.SECRET!,
      (err: Error | any, payload: any) => {
        if (err) {
          return err.message;
        } else {
          return payload.id;
        }
      }
    );

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
      message: "Account verified",
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

// export const inputOtp = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { token } = req.body;

//     const user = await authModel.findById(userID);

//     if (user?.verified) {
//       if (token === user.token) {
//         const update = await authModel.findByIdAndUpdate(
//           user._id,
//           {
//             password: "",
//             token: "",
//           },
//           { new: true }
//         );
//         InputOtp(user).then(() => {
//           console.log("OTP mail sent ...");
//         });

//         return res.status(HTTP.UPDATE).json({
//           message: "You can now proceed to change Password",
//           data: update,
//         });
//       } else {
//         return res.status(HTTP.BAD).json({
//           message: "Incorrect Token",
//         });
//       }
//     } else {
//       return res.status(HTTP.BAD).json({
//         message: "User is Not Verified",
//       });
//     }
//   } catch (error: any) {
//     return res.status(HTTP.BAD).json({
//       message: "Error with Your Token",
//     });
//   }
// };

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });

    //   if (user?.verified && user.token === "") {
    //     const token = crypto.randomBytes(2).toString("hex");
    //     const reset = await authModel.findByIdAndUpdate(
    //       user._id,
    //       { token },
    //       { new: true }
    //     );
    //     resetAccountPassword(user).then(() => {
    //       console.log("sent reset password email notification");
    //     });
    //     return res.status(HTTP.UPDATE).json({
    //       message: "you can reset your password go to your mail",
    //       data: reset,
    //     });
    //   } else {
    //     return res.status(HTTP.BAD).json({
    //       message: "something went wrong",
    //     });
    //   }
    // } catch (error: any) {
    //   return res.status(HTTP.BAD).json({
    //     message: "error",
    //     data: error.message,
    //   });

    if (!findUser) {
      return res.status(HTTP.BAD).json({
        message: "User  does not exist",
        status: HTTP.BAD,
      });
    }

    if (!findUser.verified && findUser.token !== "") {
      return res.status(HTTP.BAD).json({
        message: "User not verified",
        status: HTTP.BAD,
      });
    }

    const token = crypto.randomBytes(2).toString("hex");
    const reset = await User.findByIdAndUpdate(
      findUser._id,
      { token },
      { new: true }
    );

    await sendForgotPassword(findUser).then(() => {
      console.log("Password Reset Mail Sent !!!");
    });

    return res.status(HTTP.UPDATE).json({
      message: "Password Reset Email Sent",
      data: reset,
    });
  } catch (error: Error | any) {
    // console.log(error.message);
    return res.status(HTTP.BAD).json({
      message: "Error sending Password Reset Mail",
      data: error.message,
    });
  }
};
