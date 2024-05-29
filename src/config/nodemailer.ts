import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port:465, // Default port is 465 for SMTPS
  secure:true, // Set to true for SMTPS (port 465)
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendConfirmationMail = async (email: string, confirmationLink: string) => {
  try {
    const info = await transporter.sendMail({
      from:  process.env.SMTP_USERNAME,
      to: email,
      subject: 'Hello Kryptonian',
      html: `
        <p>Hello,</p>
        <p>Please click the following link to confirm your email address:</p>
        <button><a href="${confirmationLink}">Click to verify</a></button>
      `,
    });
    return info;
  } catch (error) {
    console.error('Error sending confirmation mail:', error);
    return false;
  }
};

export const sendOtp = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_ADDRESS,
      to: email,
      subject: 'Hello Kryptonian',
      text: `Your OTP is: ${otp}`,
    });
    return info;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};

export const sendApiKey = async (email: string, apikey: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_ADDRESS,
      to: email,
      subject: 'Hello Kryptonian',
      text: `Your API KEY is: ${apikey}  Keep it secure and you can not generate another`,
    });
    return info;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};