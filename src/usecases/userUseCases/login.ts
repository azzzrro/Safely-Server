import auth from "../../middlewares/auth";
import userRepository from "../../repositories/userRepository";

export default {
    loginCheckUser: async (mobile: number) => {
        const response = await userRepository.findUser(mobile);
        if (response?.mobile) {
            if(response.verified){
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", token };
            }else if(!response.identification){
                return { message: "Incomplete registration" };
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },

    GoogleLoginCheckUser: async (email: string) => {
        const response = await userRepository.GoogleFindUser(email);
        if (response?.email) {
            if(response.verified){
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", token };
            }else if(!response.identification){
                return { message: "Incomplete registration" };
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },
};
