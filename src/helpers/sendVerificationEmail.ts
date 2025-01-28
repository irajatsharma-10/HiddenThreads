import {VerificationEmail} from '../../emails/VerificationEmail';
import { ApiResponse } from "../types/ApiResponse";
import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        // Create the transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER, // Your email address
                pass: process.env.MAIL_PASS, // Your email password
            },
        });

        // Send the email
        const info = await transporter.sendMail({
            from: '"MasterRJ" <no-reply@mysterymessage.com>', // Sender address
            to: email, // Receiver email
            subject: 'Mystery message from anonymous person', // Subject line
            html: VerificationEmail({ username, otp: verifyCode }), // Email content in HTML format
        });

        console.log('Message sent: %s', info);
        console.log("email", email)
        console.log("verification code", verifyCode)
        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, message: `Failed to send verification email ${error}` };
    }
}
