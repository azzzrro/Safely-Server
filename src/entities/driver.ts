import mongoose, { Document, Schema } from "mongoose";

export interface DriverInterface extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    driverImage: string;
    referral_code: string;
    aadhar: Aadhar
    location: Location
    license: License
    account_status: string;
    verified: boolean;
    identification: boolean;
}

interface Aadhar {
    id:string,
    image:string
}

interface License {
    id:string,
    image:string
}

interface Location {
    longitude : number
    latitude : number
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
    driverImage:{
        type:String
    },
    referral_code: {
        type: String,
    },

    aadhar:{
        aadharId:{
            type:String
        },
        aadharImage:{
            type:String
        }
    },

    license:{
        licenseId:{
            type:String
        },
        licenseImage:{
            type:String
        }
    },

    location:{
        longitude: {
            type:String
        },
        latitude: {
            type:String
        }
    },

    account_status: {
        type: String,
        default: "Good",
    },
    verified: {
        type: Boolean,
        default: false,
    },
    identification: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model<DriverInterface>("Driver", DriverSchema);