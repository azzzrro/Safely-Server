import nodemailer from 'nodemailer'

export const sendMail = async (email:string,subject:string,text:string)=>{
    try {        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to: email,
            subject: subject,
            text: text,
        };
        
        await transporter.sendMail(mailOptions);

    } catch (error) {
        throw new Error((error as Error).message)
    }
}