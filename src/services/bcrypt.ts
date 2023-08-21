import bcrypt from "bcrypt";

export default {
    securePassword: async (password: string) => {
        return await bcrypt.hash(password, 10);
    },

    matchPassword: async (passwordOne: string, passwordTwo: string) => {
        return await bcrypt.compare(passwordOne, passwordTwo);
    },
};
