import auth from "../../middlewares/auth";
import userRepository from "../../repositories/userRepository";

export default {
    loginCheckUser: async (mobile: number) => {
        const response = await userRepository.findUser(mobile);
        if (response?.mobile) {
            const token = await auth.createToken(response._id.toString());
            if(response.account_status !== "Pending" && response.account_status !== "Rejected" && response.account_status !== "Blocked"){
                return { message: "Success" ,token};
            }else if(response.account_status === "Rejected"){
                return { message: "Rejected" ,token};
            }else if(response.account_status === "Blocked"){
                return { message: "Blocked" };
            }else if(!response.identification){
                return { message: "Incomplete registration",token};
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },

    GoogleLoginCheckUser: async (email: string) => {
        const response = await userRepository.GoogleFindUser(email);
        if (response?.email) {
            const token = await auth.createToken(response._id.toString());
            if(response.account_status !== "Pending" && response.account_status !== "Rejected" && response.account_status !== "Blocked"){
                return { message: "Success", token };
            }else if(response.account_status === "Rejected"){
                return { message: "Rejected",token };
            }else if(response.account_status === "Blocked"){
                return { message: "Blocked" };
            }else if(!response.identification){
                return { message: "Incomplete registration" ,token};
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },
};
