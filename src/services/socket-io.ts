import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import Ride, { RideDetails } from "../entities/ride";
import driver from "../entities/driver";
import ride from "../entities/ride";
import user from "../entities/user";


export const generatePIN = () => {
    let pin = "";
    for (let i = 0; i < 6; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    return parseInt(pin);
};

export const calculateDistance = (
    driverLatitude: number,
    driverLongitude: number,
    userLatitude: number,
    userLongitude: number
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deg2rad = (deg: any) => deg * (Math.PI / 180);
    driverLatitude = deg2rad(driverLatitude);
    driverLongitude = deg2rad(driverLongitude);
    userLatitude = deg2rad(userLatitude);
    userLongitude = deg2rad(userLongitude);

    const radius = 6371;

    const dlat = userLatitude - driverLatitude;
    const dlon = userLongitude - driverLongitude;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(driverLatitude) * Math.cos(driverLongitude) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = radius * c;

    return distance;
};

export const setUpSocketIO = (server: HttpServer): void => {
    let driverLatitude: number;
    let driverLongitude: number;
    let rideDetails: RideDetails;

    const io: SocketIOServer = new SocketIOServer(server, {
        cors: {
            origin: process.env.SOCKET_FRONTEND_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        console.log("Client-side connected:", socket.id);

        socket.on("getNearByDrivers", async (rideData: RideDetails) => {
            rideDetails = rideData;
            io.emit("getNearByDrivers");
        });

        socket.on("driverLocation", async (latitude: number, longitude: number) => {
            try {
                driverLatitude = latitude;
                driverLongitude = longitude;

                const distance = calculateDistance(
                    driverLatitude,
                    driverLongitude,
                    rideDetails.pickupCoordinates.latitude,
                    rideDetails.pickupCoordinates.longitude
                );

                if (distance <= 5) {
                    const driverIds = await driver
                        .find({ "vehicle_details.model": rideDetails.model , account_status:{$in:["Good","Warning"]},isAvailable:true})
                        .select("_id")
                        .exec();

                    const idsArray = driverIds.map((driver) => driver._id);
                    io.emit("newRideRequest", rideDetails, idsArray);
                } else {
                    console.log(distance, "greater than 5km");
                }
            } catch (error) {
                console.error("Error handling driver location:", error);
            }
        });

        socket.on("acceptRide", async (acceptedRideData: RideDetails) => {

            acceptedRideData.status = "Pending";
            acceptedRideData.pin = generatePIN();

            acceptedRideData.driverCoordinates = {};

            acceptedRideData.driverCoordinates.latitude = driverLatitude;
            acceptedRideData.driverCoordinates.longitude = driverLongitude;

            const newRide = new Ride(acceptedRideData);
            const response = await newRide.save();
            await driver.findByIdAndUpdate(acceptedRideData.driver_id,{
                isAvailable:false
            })

            io.emit("driverConfirmation", response.ride_id);
        });

        socket.on("forUser",async (ride_id) => {
            io.emit("userConfirmation", ride_id);
        })

        socket.on("verifyRide", async (pin: number) => {
            const response = await Ride.findOneAndUpdate(
                { pin: pin},
                {
                    $set: {
                        status: "Confirmed",
                    },
                },
                {
                    new: true,
                }
            );
            if(response){
                io.emit("rideConfirmed")
            }else{
                io.emit("error in confirming ride")
            }
        });

        socket.on("driverRideFinish",()=>{
            io.emit("userPaymentPage")
        })

        socket.on("paymentCompleted",(paymentMode:string,amount:number)=>{
            io.emit("driverPaymentSuccess",paymentMode,amount)
        })

        socket.on("rideCancelled", async (ride_id)=>{
            try {
                
                const rideData = await ride.findOne({ride_id:ride_id})
    
                await ride.findOneAndUpdate({ride_id:ride_id},{
                    $set:{
                        status:"Cancelled"
                    }
                })
                await driver.findByIdAndUpdate(rideData?.driver_id,{
                    $set:{
                        isAvailable:true
                    }
                })
                await user.findByIdAndUpdate(rideData?.user_id,{
                    $inc: {
                        "RideDetails.cancelledRides": 1,
                    },
                })

                io.emit("rideCancelled")
            } catch (error) {
                console.log((error as Error).message);
            }
        })


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("chat",(chat:any)=>{
            io.emit("chat",chat)
        })

        socket.on("disconnect", () => {
            console.log("Client-side disconnected:", socket.id);
        });
    });
};
