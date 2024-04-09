import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const GOOGLE_ID = process.env.G_ID!;

const GOOGLE_SECRET = process.env.G_SECRET!;

const GOOGLE_URL = process.env.G_URL!;

const GOOGLE_TOKEN = process.env.G_TOKEN!;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_TOKEN });

export const sendMail = async (user: any) => {
  try {
    const getAccess: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "udidagodswill7@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_TOKEN,
        accessToken: getAccess,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET!
    );

    const url = `http://localhost:1122/api`;
    const choiceData = {
      name: user.name,
      url: `${url}/${token}/verify`,
    };

    const data = path.join(__dirname, "../views/FirstMail.ejs");
    const realData = await ejs.renderFile(data, choiceData);

    const mailer = {
      from: "udidagodswill7@gmail.com",
      to: user.email,
      subject: "Welcome to Our Platform",
      html: realData,
    };

    transport.sendMail(mailer);
  } catch (error: any) {
    console.log(error.mesage);
  }
};

export const sendForgotPassword = async (user: any) => {
  try {
    const getAccess: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "udidagodswill7@gmail.com",
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        refreshToken: GOOGLE_TOKEN,
        accessToken: getAccess,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET!
    );

    const url = `http://localhost:1122/api`;
    const choiceData = {
      name: user.name,
      url: `${url}/${token}/verify`,
    };

    const data = path.join(__dirname, "../views/ForgotEmail.ejs");
    const realData = await ejs.renderFile(data, choiceData);

    const mailer = {
      from: "udidagodswill7@gmail.com",
      to: user.email,
      subject: "Password Reset",
      html: realData,
    };

    transport.sendMail(mailer);
  } catch (error: any) {
    console.log(error.mesage);
  }
};


