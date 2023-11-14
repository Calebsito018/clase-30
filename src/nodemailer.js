import nodemailer from "nodemailer"
import config from "./config/config.js"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    // secure: false, // use SSL
    // port: 587,
    auth:{
        user: config.gmail_user,
        pass: config.gmail_password,
    },
    // tls: {
    //     rejectUnauthorized: false
    // }
    tls : { rejectUnauthorized: false }
})