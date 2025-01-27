import { Resend } from 'resend';

// Directly assign the API key value
const RESEND_API_KEY = 're_UjNPCsgs_nYtuxrPf8Zb1LtYxRx8Zr4t5';

// Log the API key
console.log("RESEND_API_KEY:", RESEND_API_KEY);

if (!RESEND_API_KEY) {
    throw new Error("Missing API key. Please ensure RESEND_API_KEY is set.");
}

export const resend = new Resend(RESEND_API_KEY);

interface Mail{
    email: string;
    title: string;
    body: string; // html or plain text
}


import nodemailer from 'nodemailer';
const mailSender = async ({email,title,body} : Mail)=>{
    try{
        //transporter
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })
        const info =  await transporter.sendMail({
            from: "MasterDev || Rj - by Rajat",
            to : `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;
    }catch(error: unknown){
        if(error instanceof Error){
            console.error(`Error sending email: ${error.message}`);
        }
        console.log("Unexpected error occured while sending the mail")
    }
}

module.exports = mailSender;