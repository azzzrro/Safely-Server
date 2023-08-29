import { ObjectId } from "mongodb";
import driver from "../entities/driver";

interface Registration {
    name: string;
    email: string;
    mobile: number;
    password: string;
    referral_code: string;
}

interface Identification {
    driverId: ObjectId;
    aadharID: string;
    licenseID: string;
    aadharImageUrl: string;
    licenseImageUrl: string;
}

interface driverImage{
    driverId : ObjectId
    imageUrl : string
}

export default {
    findDriver: async (mobile: number) => {
        const result = await driver.findOne({ mobile: mobile });
        return result;
    },

    saveDriver: async (userData: Registration) => {
        const newDriver = new driver({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: userData.password,
            referral_code: userData.referral_code,
        });
        try {
            const savedDriver = await newDriver.save();
            return savedDriver;
        } catch (error) {
            return (error as Error).message;
        }
    },

    updateIdentification: async (driverData: Identification) => {
        const { driverId, aadharID, licenseID, aadharImageUrl, licenseImageUrl } = driverData;
        console.log(driverData, "query dattaaaa");

        const response = await driver.findByIdAndUpdate(
            driverId,
            {
                $set: {
                    aadhar:{
                        aadharId:aadharID,
                        aadharImage: aadharImageUrl
                    },
                    license:{
                        licenseId:licenseID,
                        licenseImage:licenseImageUrl
                    }
                },
            },
            {
                new: true,
            }
        );        
        return response;
    },


    updateDriverImage : async(driverData :driverImage)=>{
        try {
            const {driverId,imageUrl} = driverData
            const response = await driver.findByIdAndUpdate(driverId,{
                $set:{
                    driverImage:imageUrl,
                    // identification:true
                },
            },
            {
                new:true
            }
            )
            return response

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
}