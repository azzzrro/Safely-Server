import { Request, Response } from "express";
import registration from "../../../usecases/driverUseCases/registration";

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

    identificationUpdate: async (req: Request, res: Response) => {
        console.log(38);

        const { aadharID, licenseID } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const driverId = req.clientId;

        try {
            if (driverId) {
                const driverData = {
                    driverId,
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
        const driverId = req.clientId;

        try {
            if (driverId && req.file) {
                const driverData = {
                    driverId,
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
        const driverId = req.clientId

        try {
            if(driverId){
                const {latitude,longitude} = req.body;
                
            }
            
        } catch (error) {
            res.json((error as Error).message);
        }
    },
};
