import { Request, Response } from "express";
import login from '../../../usecases/driverUseCases/login'

export default{

    loginDriverCheck: async (req: Request, res: Response) => {
        const { mobile } = req.body;
        console.log(mobile, "mobileeee");

        try {
            const response = await login.loginCheckDriver(mobile);
            res.json(response);
        } catch (error) {
            res.json((error as Error).message);
        }
    },

    GoogleLoginDriverCheck: async (req: Request, res: Response) => {
        const { email } = req.body;
        console.log(email, "mobileeee");

        try {
            const response = await login.GoogleLoginCheckDriver(email);
            res.json(response);
        } catch (error) {
            res.json((error as Error).message);
        }
    },

}

