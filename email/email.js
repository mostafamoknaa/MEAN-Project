
import nodemailer from "nodemailer"
import  emailTemplate  from "./emailTemplate.js";
import jwt from "jsonwebtoken";

 async function sendEmail(email){ 
    const transporter =  nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mo017886@gmail.com",
        pass: "eqhm anwb nrvn pmfp",
    },
});

    const myemail = jwt.sign(email, "myemail")

  const info = await transporter.sendMail({
    from: '"this massage send from ELRO3B_STORE to verfiy your account 👻" <mo017886@gmail.com>', 
    to: email, 
    subject: "PLEASE VERIVY YOUR ACCOUNT", 
    text: "From ELRO3B_STORE WEBSITE",
    html: emailTemplate(myemail), 
  });

  console.log("Message sent: %s", info.messageId);
 
}

export default sendEmail;  //export the function to use it in other files