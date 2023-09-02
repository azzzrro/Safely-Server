import driverRepository from "../../repositories/driverRepository";
import auth from "../../middlewares/auth";

export default{
    loginCheckDriver : async (mobile: number) => {
        const response = await driverRepository.findDriver(mobile);
        if (response?.mobile) {
            if(response.account_status !== "Pending" && response.account_status === "Rejected"){
                return { message: "Success" };
            }else if(response.account_status === "Rejected"){
                return { message: "Rejected" };
            }else if(!response.identification){
                const token = await auth.createToken(response._id.toString());
                return { message: "Incomplete registration",token };
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },


    GoogleLoginCheckDriver: async (email: string) => {
        const response = await driverRepository.GoogleFindDriver(email);
        if (response?.email) {
            const token = await auth.createToken(response._id.toString());
            if(response.account_status !== "Pending" && response.account_status === "Rejected"){
                return { message: "Success", token };
            }else if(response.account_status === "Rejected"){
                return { message: "Rejected" };
            }else if(!response.identification){
                return { message: "Incomplete registration" ,token};
            }
            else{
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },
}


