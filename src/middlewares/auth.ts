import Jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import {ObjectId} from 'mongodb'


interface JwtPayload {
    clientId: ObjectId;
}


export default{
    createToken : async(clientId:ObjectId)=>{
        const jwtSecretKey = "t9rXw5bF2mS7zQ8p"
        const token = Jwt.sign({clientId},jwtSecretKey)
        return token
    },

    verifyToken: async (req: Request, res: Response, next: NextFunction) => {
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.json({ message: "Unauthorized" });
        } else {
            try {
                const jwtSecretKey = "t9rXw5bF2mS7zQ8p";
                const decodedToken = Jwt.verify(token, jwtSecretKey) as JwtPayload;
                req.clientId = decodedToken.clientId;
                next();
                
            } catch (error) {
                res.json({ message: ((error as Error).message) });
            }
        }
    }
}

