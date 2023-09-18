import { Request, Response } from "express";
import driver from "../../../entities/driver";
import { sendMail } from "../../../services/nodemailer";
import user from "../../../entities/user";

export default {
    adminLogin: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            res.json({ message: "Success",email:process.env.ADMIN_EMAIL });
        } else {
            res.json({ message: "Invalid Credentials" });
        }
    },

    pendingDrivers: async (req: Request, res: Response) => {
        const pendingDrivers = await driver.find({ account_status: "Pending" });
        res.json(pendingDrivers);
    },

    getDriverData: async (req: Request, res: Response) => {
        const id = req.query.id;
        const response = await driver.findById(id);
        res.json(response);
    },

    verifyDriver: async (req: Request, res: Response) => {
        const id = req.query.id;        
        try {
            const response = await driver.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: "Good",
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Verified Successfully"
                const text = `Hello ${response.name}, 
                Thank you for registering with safely! We're excited to have you on board. Your account has been successfully verified.
                
                Thank you for choosing Safely. We look forward to serving you and making your journeys safe and convenient.
                
                Best regards,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },

    verifiedDrivers : async (req: Request, res: Response) => {
        const verifiedDrivers = await driver.find({account_status:{$nin:["Pending","Rejected","Blocked"]}});
        res.json(verifiedDrivers);
    },

    rejectDriver : async (req: Request, res: Response) => {
        const id = req.query.id;
        const reason = req.body.reason        
        try {
            const response = await driver.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: "Rejected",
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Registration Rejected"
                const text = `Hello ${response.name}, 
                We regret to inform you that your registration with Safely has been rejected. We appreciate your interest, 
                but unfortunately, we are unable to accept your application at this time.
                
                Reason : ${reason}

                You have the option to resubmit your registration and provide any missing or updated information.

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },

    updateDriverStatus : async (req: Request, res: Response) => {
        let newStatus
        const id = req.query.id;
        const {reason,status} = req.body
        if(status === 'Block')
            newStatus = 'Blocked'
        else
        newStatus = status
        try {
            const response = await driver.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: newStatus,
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Status Updated"
                const text = `Hello ${response.name}, 

                We inform you that your Safely account status has been updated.

                Status : ${newStatus}
                Reason : ${reason}

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },

    blockedDrivers : async (req: Request, res: Response) => {
        const blocledDrivers = await driver.find({account_status: "Blocked" });
        res.json(blocledDrivers);
    },


    verifiedUsers : async (req: Request, res: Response) => {
        const verifiedUsers = await user.find({account_status:{$nin:["Pending","Rejected","Blocked"]}});
        res.json(verifiedUsers);
    },

    pendingUsers: async (req: Request, res: Response) => {
        const pendingUsers = await user.find({ account_status: "Pending" });
        res.json(pendingUsers);
    },

    blockedUsesrs : async (req: Request, res: Response) => {
        const blockedUsesrs = await user.find({account_status: "Blocked" });
        res.json(blockedUsesrs);
    },

    getUserData: async (req: Request, res: Response) => {
        const id = req.query.id;
        const response = await user.findById(id);
        res.json(response);
    },


    verifyUser: async (req: Request, res: Response) => {
        const id = req.query.id;        
        try {
            const response = await user.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: "Good",
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Verified Successfully"
                const text = `Hello ${response.name}, 
                Thank you for registering with safely! We're excited to have you on board. Your account has been successfully verified.
                
                Thank you for choosing Safely. We look forward to serving you and making your journeys safe and convenient.
                
                Best regards,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },


    rejectUser : async (req: Request, res: Response) => {
        const id = req.query.id;
        const reason = req.body.reason        
        try {
            const response = await user.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: "Rejected",
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Registration Rejected"
                const text = `Hello ${response.name}, 
                We regret to inform you that your registration with Safely has been rejected. We appreciate your interest, 
                but unfortunately, we are unable to accept your application at this time.
                
                Reason : ${reason}

                You have the option to resubmit your registration and provide any missing or updated information.

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },


    updateUserStatus : async (req: Request, res: Response) => {
        let newStatus
        const id = req.query.id;
        const {reason,status} = req.body
        if(status === 'Block')
            newStatus = 'Blocked'
        else
        newStatus = status
        try {
            const response = await user.findByIdAndUpdate(
                id,
                {
                    $set: {
                        account_status: newStatus,
                    },
                },
                {
                    new: true,
                }
            );
            
            if(response?.email){
                const subject = "Account Status Updated"
                const text = `Hello ${response.name}, 

                We inform you that your Safely account status has been updated.

                Status : ${newStatus}
                Reason : ${reason}

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`

                try {
                    await sendMail(response.email,subject,text)
                    res.json({message:"Success"})
                } catch (error) {
                    console.log(error);
                    res.json((error as Error).message)    
                }
            }else{
                res.json("Somthing error")
            }
        } catch (error) {
            res.json(error)
        }
    },
};
