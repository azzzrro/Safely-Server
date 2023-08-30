import { Request, Response } from "express";

export default{
    adminLogin : async (req:Request, res:Response)=>{
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS){
            res.json({message:"Success"})
        }else{
            res.json({message:"Invalid Credentials"})
        }
    }
}