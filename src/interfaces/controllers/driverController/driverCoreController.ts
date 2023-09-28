import { Request, Response } from "express";
import ride, { RideDetails } from "../../../entities/ride";
import driver from "../../../entities/driver";
import moment from "moment";

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

    getAllrides: async (req: Request, res: Response) => {
        const { driver_id } = req.query;
        const rideData = await ride.find({ driver_id: driver_id }).sort({date:-1});
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
        res.json(rideData);
    },

    dashboardData: async (req: Request, res: Response) => {
        const { driver_id } = req.query;

        try {
            const data = await ride
                .aggregate([
                    {
                        $match: {
                            status: { $nin: ["Cancelled", "Pending"] },
                            driver_id: driver_id,
                        },
                    },
                    {
                        $group: {
                            _id: { $month: "$date" },
                            totalAmount: { $sum: "$price" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            month: "$_id",
                            totalAmount: 1,
                        },
                    },
                    {
                        $sort: { month: 1 },
                    },
                ])
                .exec();

            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            const chartData = data.map((item) => ({
                name: monthNames[item.month - 1],
                Earnings: item.totalAmount,
            }));

            const pieChartData = await ride
                .aggregate([
                    {
                        $match: {
                            status: { $nin: ["Cancelled", "Pending"] },
                            driver_id: driver_id,
                        },
                    },
                    {
                        $group: {
                            _id: "$paymentMode",
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$_id",
                            value: "$count",
                        },
                    },
                ])
                .exec();

            const driverData = await driver.findById(driver_id);

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;

            const count = await ride
                .aggregate([
                    {
                        $match: {
                            status: "Completed",
                            date: {
                                $gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1), // Start of current month
                                $lt: new Date(currentDate.getFullYear(), currentMonth, 1), // Start of next month
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalCount: { $sum: 1 },
                        },
                    },
                ])
                .exec();

            res.json({ chartData, pieChartData, driverData, CurrentMonthRides: count[0].totalCount });
        } catch (error) {
            res.status(500).json((error as Error).message);
        }
    },

    getDriverData: async (req: Request, res: Response) => {
        const { driver_id } = req.query;
        const driverData = await driver.findById(driver_id);
        res.json(driverData);
    },

    profileUpdate: async (req: Request, res: Response) => {
        const { driver_id } = req.query;
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

            const driverData = await driver
                .findOneAndUpdate({ _id: driver_id }, { $set: updateFields }, { new: true })
                .exec();

            res.json({ message: "Success", driverData });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },

    updateStatus: async (req: Request, res: Response) => {
        const { driver_id } = req.query;
        console.log("helloo",driver_id)
        try {
            const data = await driver.findById(driver_id)
            const driverData = await driver.findByIdAndUpdate(
                driver_id,
                {
                    $set: {
                        isAvailable: !data?.isAvailable,
                    },
                },
                {
                    new: true,
                }
            );
            res.status(201).json({ message: "Success", driverData });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    },
};
