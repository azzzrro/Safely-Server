import { Request, Response } from "express";
import registration from "../../../usecases/userUseCases/registration";
import { ObjectId } from "mongodb";



export default {
    signup: async (req: Request, res: Response) => {
        const { name, email, mobile, password, reffered_Code } = req.body;
        const userData = {
            name,
            email,
            mobile,
            password,
            reffered_Code,
        };
        try {
            const response = await registration.personal_details(userData);
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
        
        const { chooseID, enterID } = req.body;

        const userId: string = req.query.driverId as string
                
        try {
            
            if (userId && req.file) {
    
                const userData = {
                    userId : new ObjectId(userId),
                    chooseID,
                    enterID,
                    file : req.file
                };
    
                const response = await registration.identification_update(userData);
                res.json(response);
            } else {
                res.json({ message: "something error" });
            }
        } catch (error) {
            res.json(error)
        }
        
    },

    uploadUserImage : async(req:Request,res:Response)=>{
        const userId: string = req.query.driverId as string
        
        try {
            if(userId && req.file){
                const userData = {
                    userId : new ObjectId(userId),
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
