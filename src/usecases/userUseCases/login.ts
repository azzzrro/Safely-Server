import auth from "../../middlewares/auth";
import userRepository from "../../repositories/userRepository";

export default {
    loginCheckUser: async (mobile: number) => {
        const response = await userRepository.findUser(mobile);
        if (response?.mobile) {
            if (
                response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked"
                ) {
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", name: response.name, token,_id:response._id };
            } else if (response.account_status === "Rejected") {
                return { message: "Rejected", userId:response._id };
            } else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            } else if (!response.identification) {
                return { message: "Incomplete registration", userId:response._id  };
            } else {
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },

    GoogleLoginCheckUser: async (email: string) => {
        const response = await userRepository.GoogleFindUser(email);
        if (response?.email) {
            if (
                response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked"
                ) {
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", name: response.name, token,_id:response._id };
            } else if (response.account_status === "Rejected") {
                return { message: "Rejected", userId:response._id };
            } else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            } else if (!response.identification) {
                return { message: "Incomplete registration", userId:response._id };
            } else {
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },
};
