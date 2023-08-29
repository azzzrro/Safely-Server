import { ObjectId } from "mongodb";
import user from "../entities/user";

interface registration {
    name: string;
    email: string;
    mobile: number;
    password: string;
    referral_code: string;
}

interface Identification {
    userId: ObjectId;
    chooseID: string;
    enterID: string;
    imageUrl: string;
}

interface userImage{
    userId : ObjectId
    imageUrl : string
}

export default {
    findUser: async (mobile: number) => {
        const result = await user.findOne({ mobile: mobile });
        return result;
    },

    GoogleFindUser: async (email: string) => {
        const result = await user.findOne({ email: email });
        return result;
    },

    saveUser: async (userData: registration) => {
        const newUser = new user({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: userData.password,
            referral_code: userData.referral_code,
        });
        try {
            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            return (error as Error).message;
        }
    },

    updateIdentification: async (userData: Identification) => {
        const { userId, chooseID, enterID, imageUrl } = userData;
        console.log(userData, "query dattaaaa");

        const response = await user.findByIdAndUpdate(
            userId,
            {
                $set: {
                    id_type: chooseID,
                    id: enterID,
                    id_image: imageUrl,
                },
            },
            {
                new: true,
            }
        );        
        return response;
    },

    updateUserImage : async(userData :userImage)=>{
        try {
            const {userId,imageUrl} = userData
            const response = await user.findByIdAndUpdate(userId,{
                $set:{
                    userImage:imageUrl,
                    identification:true
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
};
