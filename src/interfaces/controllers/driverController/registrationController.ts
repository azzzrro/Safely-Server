import { Request, Response } from "express";
import registration from "../../../usecases/driverUseCases/registration";
import uploadToS3 from "../../../services/awsS3";
import driver from "../../../entities/driver";
import { ObjectId } from "mongodb";

export default {
    checkDriver: async (req: Request, res: Response) => {
        const { mobile } = req.body;
        try {
            const response = await registration.checkDriver(mobile);
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },

    register: async (req: Request, res: Response) => {
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
            console.log(response, "responseee");
            res.json(response);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    },

    identificationUpdate: async (req: Request, res: Response) => {
        const { aadharID, licenseID } = req.body;
        const driverId: string = req.query.driverId as string
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        try {
            if (driverId) {
                const driverData = {
                    driverId : new ObjectId(driverId),
                    aadharID,
                    licenseID,
                    aadharFile: files["aadharImage"][0],
                    licenseFile: files["licenseImage"][0],
                };

                const response = await registration.identification_update(driverData);
                console.log(response, "responseyyy");
                res.json(response);
            } else {
                res.json({ message: "something error" });
            }
        } catch (error) {
            res.json(error);
        }
    },

    uploadDriverImage: async (req: Request, res: Response) => {
        const driverId: string = req.query.driverId as string

        try {
            if (driverId && req.file) {
                const driverData = {
                    driverId : new ObjectId(driverId),
                    file: req.file,
                };

                const response = await registration.driverImage_update(driverData);
                res.json(response);
            } else {
                res.json({ message: "Something error" });
            }
        } catch (error) {
            res.json((error as Error).message);
        }
    },

    locationUpdate: async (req: Request, res: Response) => {
        const driverId: string = req.query.driverId as string
        
        try {
            if (driverId) {
                const { latitude, longitude } = req.body;

                const data = {
                    driverId : new ObjectId(driverId),
                    latitude,
                    longitude,
                };
                const response = await registration.location_update(data);
                res.json(response);
            }
        } catch (error) {
            res.json((error as Error).message);
        }
    },

    vehicleUpdate :async (req: Request, res: Response) => {
        try {
            console.log("inside vehicleeeee");
            
            const {registerationID,model} = req.body
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const driverId: ObjectId = req.query.driverId as unknown as ObjectId

            console.log(registerationID,model,driverId);
            
            const rcImageUrl = await uploadToS3(files["rcImage"][0])
            const carImageUrl = await uploadToS3(files["carImage"][0])
                        
            const response = await driver.findByIdAndUpdate(driverId,{
                $set:{
                    vehicle_details:{
                        registerationID,
                        model,
                        rcImageUrl,
                        carImageUrl
                    }
                }
            },{
                new:true
            })

            console.log(response,"vehickeeee");
            

            if(response?.email){
                res.json({message:"Success"})
            }else{
                res.json({message:"Something Error"})
            }

        } catch (error) {
            res.json((error as Error).message)
        }
    }
};
