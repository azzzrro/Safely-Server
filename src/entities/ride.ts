import mongoose, { Document, Schema } from "mongoose";

export interface RideDetails extends Document {
    ride_id: string;
    driver_id: string;
    user_id: string;
    pickupCoordinates: PickupCoordinates;
    dropoffCoordinates: DropoffCoordinates;
    pickupLocation: string;
    dropoffLocation: string;
    driverCoordinates?: {
        latitude?: number;
        longitude?: number;
      };
    distance: string;
    duration: string;
    model: string;
    price: number;
    date: Date;
    status: string;
    pin: number;
}

interface PickupCoordinates {
    latitude: number;
    longitude: number;
}

interface DropoffCoordinates {
    latitude: number;
    longitude: number;
}

// interface DriverCoordinates {
//     latitude: number;
//     longitude: number;
// }

const RideSchema: Schema = new Schema({
    ride_id: {
        type: String,
    },
    driver_id: {
        type: String,
    },
    user_id: {
        type: String,
    },
    pickupCoordinates: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    dropoffCoordinates: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    pickupLocation: {
        type: String,
    },
    dropoffLocation: {
        type: String,
    },
    driverCoordinates: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
    },
    distance: {
        type: String,
    },
    duration: {
        type: String,
    },
    model: {
        type: String,
    },
    price: {
        type: Number,
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
    },
    pin: {
        type: Number,
    },
});

export default mongoose.model<RideDetails>("Ride", RideSchema);
