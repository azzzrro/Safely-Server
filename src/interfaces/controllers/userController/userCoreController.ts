import { Request, Response } from "express";
import ride, { RideDetails } from "../../../entities/ride";
import driver from "../../../entities/driver";
import user from "../../../entities/user";
import { ObjectId } from "mongodb";

export default {
    getCurrentRide: async (req: Request, res: Response) => {
        const rideId = req.query.rideId;
        const rideData: RideDetails | null = await ride.findOne({ ride_id: rideId });
        if (rideData) {
            const driverData = await driver.findOne({ _id: rideData.driver_id });
            res.json({ rideData, driverData });
        } else {
            res.json({ message: "Something error" });
        }
    },

    payment: async (req: Request, res: Response) => {
        const { amount, paymentMode } = req.body;
        console.log(amount, paymentMode, 1);

        const rideId = req.query.rideId;

        console.log(rideId, 2);

        const rideData = await ride.findOne({ ride_id: rideId });

        console.log(rideData, 3);

        const userId = new ObjectId(rideData?.user_id);
        const driverId = new ObjectId(rideData?.driver_id);

        console.log(userId, driverId, 3);

        const userData = await user.findById(userId);
        const driverData = await driver.findById(driverId);

        console.log(userData, driverData, 4);

        if (userData && driverData) {
            if (paymentMode === "COD") {
                try {
                    await driver.findByIdAndUpdate(
                        driverId,
                        {
                            $inc: {
                                "RideDetails.completedRides": 1,
                                "RideDetails.totalEarnings": amount,
                            },
                            rideStatus:false
                        }
                    );
                    await user.findByIdAndUpdate(userId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });
                    res.json({ message: "Success" });
                } catch (error) {
                    res.json((error as Error).message);
                }
            } else if (paymentMode === "wallet") {
                try {
                    const userNewBalance = userData?.wallet.balance - amount;
                    const userTransaction = {
                        date: new Date(),
                        details: `Payment for the ride ${rideId}`,
                        amount: -amount,
                        status: "Debit",
                    };

                    await user.findByIdAndUpdate(userId, {
                        $set: {
                            "wallet.balance": userNewBalance,
                        },
                        $push: {
                            "wallet.transactions": userTransaction,
                        },
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });

                    const driverNewBalance = driverData.wallet.balance + amount;
                    const driverTransaction = {
                        date: new Date(),
                        details: `Payment for the ride ${rideId}`,
                        amount: amount,
                        staus: "Credit",
                    };

                    await driver.findByIdAndUpdate(driverId, {
                        $set: {
                            "wallet.balance": driverNewBalance,
                        },
                        $push: {
                            "wallet.transactions": driverTransaction,
                        },
                        $inc: {
                            "RideDetails.completedRides": 1,
                            "RideDetails.totalEarnings": amount,
                        },
                        rideStatus:false
                    });
                    res.json({ message: "Success" });
                } catch (error) {
                    res.json((error as Error).message);
                }
            }
        }
    },

    getUserData: async (req: Request, res: Response) => {
        const id = req.query.id;
        const response = await user.findById(id);
        res.json(response);
    },
};
