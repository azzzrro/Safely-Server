import mongoose from "mongoose";
import dotenv  from "dotenv"
dotenv.config()


const connectDB = async():Promise<void>=>{
    try{
        const url = process.env.MONGO_URL
        if(!url){
            throw new Error("MONGO_URL is not defined in environment variables.")
        }
        await mongoose.connect(url);
        console.log("database connected");   
    }catch(error){
        console.error('Error connecting to MongoDB:', error)      
    }
}

export default connectDB