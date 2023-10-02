import mongoose, { Document, Schema } from "mongoose";

export interface DriverInterface extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    driverImage: string;
    referral_code: string;
    aadhar: Aadhar;
    location: Location;
    license: License;
    account_status: string;
    identification: boolean;
    vehicle_details: Vehicle;
    joiningDate: Date;
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    RideDetails: {
        completedRides: number;
        cancelledRides: number;
        totalEarnings: number;
    };
    isAvailable: boolean;
    feedbacks: [
        {
            feedback: string;
            rating: number;
            date:Date
        }
    ];
}

interface Aadhar {
    id: string;
    image: string;
}

interface License {
    id: string;
    image: string;
}

interface Location {
    longitude: number;
    latitude: number;
}

interface Vehicle {
    registerationID: string;
    model: string;
    rcImageUrl: string;
    carImageUrl: string;
}

const DriverSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    driverImage: {
        type: String,
    },
    referral_code: {
        type: String,
    },
    joiningDate: {
        type: Date,
        deafult: Date.now(),
    },
    aadhar: {
        aadharId: {
            type: String,
        },
        aadharImage: {
            type: String,
        },
    },

    license: {
        licenseId: {
            type: String,
        },
        licenseImage: {
            type: String,
        },
    },

    location: {
        longitude: {
            type: String,
        },
        latitude: {
            type: String,
        },
    },

    vehicle_details: {
        registerationID: {
            type: String,
        },
        model: {
            type: String,
        },
        rcImageUrl: {
            type: String,
        },
        carImageUrl: {
            type: String,
        },
    },

    account_status: {
        type: String,
    },
    identification: {
        type: Boolean,
        default: false,
    },

    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                date: {
                    type: Date,
                },
                details: {
                    type: String,
                },
                amount: {
                    type: Number,
                },
                status: {
                    type: String,
                },
            },
        ],
    },
    RideDetails: {
        completedRides: {
            default: 0,
            type: Number,
        },
        cancelledRides: {
            default: 0,
            type: Number,
        },
        totalEarnings: {
            type: Number,
            default: 0,
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    totalRatings:{
        type:Number,
        default: 0,

    },
    feedbacks: [
        {
            feedback: {
                type: String,
            },
            rating: {
                type: Number,
            },
            date:{
                type:Date
            }
        },
    ],
});

export default mongoose.model<DriverInterface>("Driver", DriverSchema);
