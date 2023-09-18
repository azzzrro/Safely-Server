import driverRepository from "../../repositories/driverRepository";
import auth from "../../middlewares/auth";

export default {
    loginCheckDriver: async (mobile: number) => {
        const response = await driverRepository.findDriver(mobile);
        if (response?.mobile) {
            if (
                response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked"
                ) {
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", name: response.name, token, _id:response._id };
            } else if (response.account_status === "Rejected") {
                return { message: "Rejected", driverId:response._id };
            } else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            } else if (!response.identification) {
                return { message: "Incomplete registration", driverId:response._id };
            } else {
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },

    GoogleLoginCheckDriver: async (email: string) => {
        const response = await driverRepository.GoogleFindDriver(email);
        if (response?.email) {
            if (
                response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked"
                ) {
                const token = await auth.createToken(response._id.toString());
                return { message: "Success", name: response.name, token, _id:response._id };
            } else if (response.account_status === "Rejected") {
                return { message: "Rejected", driverId:response._id };
            } else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            } else if (!response.identification) {
                return { message: "Incomplete registration", driverId:response._id };
            } else {
                return { message: "Not verified" };
            }
        } else return { message: "No user found" };
    },
};
