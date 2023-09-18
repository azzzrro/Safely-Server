import { Request, Response } from "express";
import login from "../../../usecases/userUseCases/login";

export default {
    loginUserCheck: async (req: Request, res: Response) => {
        const { mobile } = req.body;
        try {
            const response = await login.loginCheckUser(mobile);
            res.json(response);
        } catch (error) {
            res.json((error as Error).message);
        }
    },

    GoogleLoginUserCheck: async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const response = await login.GoogleLoginCheckUser(email);
            res.json(response);
        } catch (error) {
            res.json((error as Error).message);
        }
    },
};
