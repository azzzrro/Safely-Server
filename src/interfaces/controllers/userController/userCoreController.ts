import { Request, Response } from "express";
import ride, { RideDetails } from "../../../entities/ride";
import driver from "../../../entities/driver";
import user from "../../../entities/user";
import { ObjectId } from "mongodb";
import Stripe from "stripe";
import moment from "moment";

export default {
    getCurrentRide: async (req: Request, res: Response) => {
        const rideId = req.query.rideId;
        const rideData: RideDetails | null = await ride.findOne({ ride_id: rideId });
        if (rideData) {
            const driverData = await driver.findOne({ _id: rideData.driver_id });
            if(driverData){
                const formattedRideDate = {...driverData?.toObject()}
                    const formattedFeedbacks = formattedRideDate?.feedbacks.map((feedbacks)=> ({
                        ...feedbacks,
                        formattedDate:moment(feedbacks.date).format("DD-MM-YYYY")
                    }))
                    const newData ={...formattedRideDate,formattedFeedbacks}
                    res.json({ rideData, driverData:newData });
                }
        } else {
            res.json({ message: "Something error" });
        }
    },

    payment: async (req: Request, res: Response) => {
        const { amount, paymentMode } = req.body;

        const rideId = req.query.rideId;

        const rideData = await ride.findOne({ ride_id: rideId });

        const userId = new ObjectId(rideData?.user_id);
        const driverId = new ObjectId(rideData?.driver_id);

        const userData = await user.findById(userId);
        const driverData = await driver.findById(driverId);

        if (userData && driverData) {
            console.log("undalloooo");
            console.log("heeeeee");

            if (paymentMode === "Cash in hand") {
                try {
                    await driver.findByIdAndUpdate(driverId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                            "RideDetails.totalEarnings": amount,
                        },
                        isAvailable: true,
                    });
                    await user.findByIdAndUpdate(userId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });

                    await ride.findOneAndUpdate(
                        { ride_id: rideId },
                        {
                            paymentMode: paymentMode,
                            status: "Completed",
                        }
                    );

                    res.json({ message: "Success" });
                } catch (error) {
                    res.json((error as Error).message);
                }
            } else if (paymentMode === "Wallet") {
                try {
                    const userNewBalance = userData?.wallet.balance - amount;
                    const userTransaction = {
                        date: new Date(),
                        details: `Payment for the ride ${rideId}`,
                        amount: amount,
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
                        status: "Credit",
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
                        isAvailable: true,
                    });

                    await ride.findOneAndUpdate(
                        { ride_id: rideId },
                        {
                            paymentMode: paymentMode,
                            status: "Completed",
                        }
                    );

                    res.json({ message: "Success" });
                } catch (error) {
                    res.json((error as Error).message);
                }
            }
        }
    },

    paymentStripe: async (req: Request, res: Response) => {
        const { amount } = req.body;
        const rideId = req.query.rideId;

        const stripe = new Stripe(process?.env.STRIPE_SECRET_KEY as string, {
            apiVersion: "2023-08-16",
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Safely-cab-booking",
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `https://safely-pink.vercel.app/rides?rideId=${rideId}`,
            cancel_url: "https://safely-pink.vercel.app/rides",
        });

        if (session) {
            console.log(session, "session und");

            try {
                const rideData = await ride.findOne({ ride_id: rideId });
                console.log(rideData, "ridedataa");
                const userId = new ObjectId(rideData?.user_id);
                const driverId = new ObjectId(rideData?.driver_id);

                const driverData = await driver.findById(driverId);

                const driverNewBalance = driverData?.wallet.balance + amount;
                const driverTransaction = {
                    date: new Date(),
                    details: `Payment for the ride ${rideId}`,
                    amount: amount,
                    status: "Credit",
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
                    isAvailable: true,
                });
                await user.findByIdAndUpdate(userId, {
                    $inc: {
                        "RideDetails.completedRides": 1,
                    },
                });

                await ride.findOneAndUpdate(
                    { ride_id: rideId },
                    {
                        paymentMode: "Card payment",
                        status: "Completed",
                    }
                );
                res.json({ id: session.id });
            } catch (error) {
                res.status(500).json((error as Error).message);
            }
        } else {
            console.log("no session");
            res.json({ message: "No session" });
        }
    },

    getUserData: async (req: Request, res: Response) => {
        const id = req.query.id;
        const response = await user.findById(id);
        if(response){
            const formattedDate = moment(response.joiningDate).format("dddd, DD-MM-YYYY")
            const formattedUserData = { ...response.toObject(), formattedDate };
            const formattedTransactions = formattedUserData.wallet.transactions.map((transactions)=>({
                ...transactions,
                formattedDate:moment(transactions.date).format("dddd, DD-MM-YYYY")
            }))
            const newData = {...formattedUserData,formattedTransactions}
            res.json(newData);
        }else{
            res.status(500).json({message:"Soemthing Internal Error"})
        }
    },

    getAllrides: async (req: Request, res: Response) => {
        const { user_id } = req.query;
        const rideData = await ride.find({ user_id: user_id }).sort({ date: -1 });
        console.log(rideData)
        if (rideData) {
            const formattedData = rideData.map((ride) => ({
                ...ride.toObject(),
                date: moment(ride.date).format("dddd, DD-MM-YYYY"),
            }));
            res.json(formattedData);
        }else{
            res.status(500).json({message:"Soemthing Internal Error"})
        }
    },

    getRideDetails: async (req: Request, res: Response) => {
        const { ride_id } = req.query;
        const rideData = await ride.findOne({ ride_id: ride_id });
        const driverData = await driver.findById(rideData?.driver_id);
        if(rideData){
            const formattedDate = moment(rideData.date).format("dddd, DD-MM-YYYY")
            const formattedRideData = { ...rideData.toObject(), formattedDate };
            res.json({ rideData:formattedRideData, driverData });
        }else{
            res.status(500).json({message:"Soemthing Internal Error"})
        }
    },

    feedback: async (req: Request, res: Response) => {
        const { _id } = req.query;
        const { rating, feedback } = req.body;
        try {
            const rideData = await ride.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        rating: rating,
                        feedback: feedback,
                    },
                },
                { new: true }
            );

            const newFeedback = {
                feedback : feedback,
                rating : rating,
                date:Date.now()
            }
            await driver.findByIdAndUpdate(rideData?.driver_id, {
                $inc: {
                    totalRatings : 1,
                },
                $push:{
                    feedbacks : newFeedback
                }
            });
            res.json({ message: "Success" });
        } catch (error) {
            res.status(500).json((error as Error).message);
        }
    },

    profileUpdate: async (req: Request, res: Response) => {
        const { user_id } = req.query;
        const { name, email, mobile } = req.body;

        try {
            const updateFields: { name?: string; email?: string; mobile?: number } = {};

            if (name) {
                updateFields.name = name;
            }

            if (email) {
                updateFields.email = email;
            }

            if (mobile) {
                updateFields.mobile = mobile;
            }

            const userData = await user.findOneAndUpdate({ _id: user_id }, { $set: updateFields }, { new: true }).exec();

            res.json({ message: "Success", userData });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    addbalance: async (req: Request, res: Response) => {
        try {
            const { balance } = req.body;
            const user_id = req.query.user_id;

            console.log(balance,user_id);
            

            const stripe = new Stripe(process?.env.STRIPE_SECRET_KEY as string, {
                apiVersion: "2023-08-16",
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: "Wallet recharge",
                            },
                            unit_amount: balance * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: `https://safely-pink.vercel.app/profile`,
                cancel_url: "https://safely-pink.vercel.app/profile",
            });

            if (session) {
                console.log(session,"undddd");
                
                const userData = await user.findById(user_id);
                if (userData?.wallet.balance) {
                    const userNewBalance = userData.wallet.balance + Number(balance);
                    const userTransaction = {
                        date: new Date(),
                        details: `Wallet recharged`,
                        amount: balance,
                        status: "Credit",
                    };

                    console.log(userNewBalance,userTransaction);
                    

                    await user.findByIdAndUpdate(user_id, {
                        $set: {
                            "wallet.balance": userNewBalance,
                        },
                        $push: {
                            "wallet.transactions": userTransaction,
                        },
                    });

                    console.log(session.id,"iddd");

                    res.json({ id: session.id });
                }
            } else {
                res.json({ message: "No session" });
            }
        } catch (error) {
            res.status(500).json((error as Error).message);
        }
    },
};
