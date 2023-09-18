import { Request, Response } from "express";
import ride,{RideDetails} from "../../../entities/ride";
import driver from "../../../entities/driver";

export default{
    getCurrentRide :async (req:Request,res:Response) => {
        const rideId = req.query.rideId
        const rideData:RideDetails | null = await ride.findOne({ride_id:rideId})
        if(rideData){
            const driverData = await driver.findOne({_id:rideData.driver_id})
            res.json({rideData,driverData})
        }
        else{
            res.json({message:"Something error"})
        }
    }
}