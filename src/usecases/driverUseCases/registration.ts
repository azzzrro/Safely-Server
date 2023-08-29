import driverRepository from "../../repositories/driverRepository";
import auth from "../../middlewares/auth";
import { refferalCode } from "../../utilities/referralCode";
import bcrypt from "../../services/bcrypt";
import { ObjectId } from "mongodb";
import uploadToS3 from "../../services/awsS3";


interface DriverData {
    name: string;
    email: string;
    mobile: number;
    password: string;
    reffered_Code: string;
}

interface identification {
    driverId: ObjectId;
    aadharID: string;
    licenseID: string;
    aadharFile: Express.Multer.File;
    licenseFile: Express.Multer.File;
}

interface driverImage{
    driverId:ObjectId
    file : Express.Multer.File
}

export default{
    checkDriver: async (mobile: number) => {
        try {
            const response = await driverRepository.findDriver(mobile);
            if (response) {
                if (response.identification) {
                    return { message: "Driver login" };
                } else {
                    const token = await auth.createToken(response._id.toString());
                    console.log(response._id.toString());
                    return { message: "Driver must fill documents", token };
                }
            }
            return "Driver not registered";
        } catch (error) {
            return { message: (error as Error).message };
        }
    },

    personal_details: async (userData: DriverData) => {
        const { name, email, mobile, password, reffered_Code } = userData;
        console.log(reffered_Code);

        const referral_code = refferalCode();
        const hashedPassword = await bcrypt.securePassword(password);
        const newDriverData = {
            name,
            email,
            mobile,
            password: hashedPassword,
            referral_code: referral_code,
        };

        const response = await driverRepository.saveDriver(newDriverData);
        if(typeof response !== "string" && response.email){
            const token = await auth.createToken(response._id.toString());
            return {message: "Success",token};
        }
    },

    identification_update: async (driverData: identification) => {
        const { driverId, aadharID, licenseID, aadharFile, licenseFile } = driverData;
        try {
            const aadharImageUrl = await uploadToS3(aadharFile)
            const licenseImageUrl = await uploadToS3(licenseFile)
            
            const newDriverData = {
                driverId,
                aadharID,
                licenseID,
                aadharImageUrl,
                licenseImageUrl
            };
            console.log(newDriverData,"newuserdattaaa");
            

            const response = await driverRepository.updateIdentification(newDriverData);
            if(response?.email)
            return ({message:"Success"})
            else
            return ({message:"Couldn't update now. Try again later!"});
        } catch (error) {
            return error;
        }
    },

    driverImage_update : async(driverData : driverImage)=>{
        try {
            const {driverId,file} = driverData
            const  imageUrl = await uploadToS3(file)

            const newDriverData = {
                driverId,
                imageUrl
            }

            const response = await driverRepository.updateDriverImage(newDriverData)
            if(response?.email){
                return ({message : "Success"})
            }else{
                return ({message : "User not found"})
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

}