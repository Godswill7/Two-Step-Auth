import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcrypt";
import crypto from "crypto"
import { HTTP } from "../Error/mainError";


export const createUser = async (req:Request,res:Response) => {
    try {
        const { name, email, password } = req.body;

        const Salt = await bcrypt.genSalt(5)
        const encrypt = await bcrypt.hash(password, Salt)

        const OtpCode = crypto.randomBytes(2).join("hex");
        const tokenCode = crypto.randomBytes(10).toString("hex");


        const user = await User.create({
            name,
            email,
            password: encrypt,
            OTP: OtpCode,
            token:tokenCode
        })

        return res.status(HTTP.CREATE).json({
            message: "User created successfully",
            data: user
        })
        
    } catch (error: any) {
        console.log(error.message)
        return res.status(HTTP.BAD).json({
        message:error.message
    })
}    
}