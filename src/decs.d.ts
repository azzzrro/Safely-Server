// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';
import {ObjectId} from 'mongodb'

declare global {
    namespace Express {
        interface Request {
            userId?: ObjectId; // Add your custom property here
        }
    }
}
