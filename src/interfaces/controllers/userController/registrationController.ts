import { Request, Response } from "express";
import registration from "../../../usecases/userUseCases/registration";



export default {
    signup: async (req: Request, res: Response) => {
        const { name, email, mobile, password, reffered_Code } = req.body;
        console.log(req.body, "helooloo");
        const userData = {
            name,
            email,
            mobile,
            password,
            reffered_Code,
        };
        try {
            const response = await registration.personal_details(userData);
            console.log(response, "responseee");
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },

    checkUser: async (req: Request, res: Response) => {
        const { mobile } = req.body;
        try {
            const response = await registration.checkUser(mobile);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },

    identificationUpdate: async (req: Request, res: Response) => {
        console.log(38);
        
        const { chooseID, enterID } = req.body;

        const userId = req.clientId;
        
        console.log(chooseID,enterID,userId);
        
        try {
            
            if (userId && req.file) {
    
                const userData = {
                    userId,
                    chooseID,
                    enterID,
                    file : req.file
                };
    
                const response = await registration.identification_update(userData);
                console.log(response,"responseyyy");
                res.json(response);
            } else {
                res.json({ message: "something error" });
            }
        } catch (error) {
            res.json(error)
        }
        
    },

    uploadUserImage : async(req:Request,res:Response)=>{
        const userId = req.clientId
        
        try {
            if(userId && req.file){
                const userData = {
                    userId,
                    file:req.file
                }
                
                const response = await registration.userimage_update(userData)
                res.json(response)
            }else{
                res.json({message:"Something error"})
            }
        } catch (error) {
            res.json((error as Error).message)
        }

    }
};
