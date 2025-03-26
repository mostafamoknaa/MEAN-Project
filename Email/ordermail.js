import nodemailer from "nodemailer"
import { emailTemplate } from "./temp.js";
import jwt from "jsonwebtoken";

export async function sendEmail(email, orderData) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "noteappopensource@gmail.com",
            pass: "rgcs tyzv qvge uzvj",
        },
    });

    const myemail = jwt.sign(email, "myemail")

    let emailHtml = emailTemplate(orderData);

    const info = await transporter.sendMail({
        from: '"E-Commerce System" <noteappopensource@gmail.com>',
        to: email,
        subject: "Order Confirmation - Your Order #" + orderData.orderId,
        html: emailHtml,
    });

    console.log("Message sent: %s", info.messageId);

}