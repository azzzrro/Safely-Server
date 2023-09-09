import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
    name: string;
    email: string;
    mobile: number;
    password: string;
    userImage: string;
    referral_code: string;
    id_type: string;
    id: string;
    id_image: string;
    account_status: string;
    verified: boolean;
    identification: boolean;
}

// interface Image {
//     public_id: string;
//     url: string;
// }

// interface IdImage {
//     public_id: string;
//     url: string;
// }

const UserSchema: Schema = new Schema({
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
    userImage:{
        type:String
    },
    referral_code: {
        type: String,
    },

    id_type: {
        type: String,
    },
    id: {
        type: String,
    },
    id_image: {
        type: String,
    },

    account_status: {
        type: String,
    },
    identification: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model<UserInterface>("User", UserSchema);
