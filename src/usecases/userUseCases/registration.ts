import userRepository from "../../repositories/userRepository";
import { refferalCode } from "../../utilities/referralCode";
import bcryptUtils from "../../services/bcrypt";
import auth from "../../middlewares/auth";
import { ObjectId } from "mongodb";
import uploadToS3 from '../../services/awsS3'


interface userData {
    name: string;
    email: string;
    mobile: number;
    password: string;
    reffered_Code: string;
}

interface identification {
    userId: ObjectId;
    chooseID: string;
    enterID: string;
    file: Express.Multer.File;
}

interface userImage{
    userId : ObjectId
    file : Express.Multer.File
}

export default {
    checkUser: async (mobile: number) => {
        try {
            const response = await userRepository.findUser(mobile);
            if (response) {
                if (response.identification) {
                    return { message: "User login" };
                } else {
                    const token = await auth.createToken(response._id.toString());
                    console.log(response._id.toString());
                    return { message: "User must fill documents", token };
                }
            }
            return "User not registered";
        } catch (error) {
            return { message: (error as Error).message };
        }
    },

    personal_details: async (userData: userData) => {
        const { name, email, mobile, password, reffered_Code } = userData;
        console.log(reffered_Code);

        const referral_code = refferalCode();
        const hashedPassword = await bcryptUtils.securePassword(password);
        const newUserData = {
            name,
            email,
            mobile,
            password: hashedPassword,
            referral_code: referral_code,
        };
        const response = await userRepository.saveUser(newUserData);

        return response;
    },

    identification_update: async (userData: identification) => {
        const { userId, chooseID, enterID, file } = userData;
        try {
            const imageUrl = await uploadToS3(file)
            const newUserData = {
                userId,
                chooseID,
                enterID,
                imageUrl
            };
            console.log(newUserData,"newuserdattaaa");
            

            const response = await userRepository.updateIdentification(newUserData);
            if(response?.email)
            return ({message:"Success"})
            else
            return ({message:"Couldn't update now. Try again later!"});
        } catch (error) {
            return error;
        }
    },

    userimage_update : async(userData : userImage)=>{
        try {
            const {userId,file} = userData
            const  imageUrl = await uploadToS3(file)

            const newUserData = {
                userId,
                imageUrl
            }

            const response = await userRepository.updateUserImage(newUserData)
            if(response?.email){
                return ({message : "Success"})
            }else{
                return ({message : "User not found"})
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
};
