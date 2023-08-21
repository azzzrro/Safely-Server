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

export default {
    findUser: async (mobile: number) => {
        const result = await user.findOne({ mobile: mobile });
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

    update_identification: async (userData: Identification) => {
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
        console.log(response,"after databaseeeeeeeeee");
        
        return response;
    },
};
