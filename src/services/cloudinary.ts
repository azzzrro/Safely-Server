import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinaryConfig";

export default {
    uploadImage : async (image: string): Promise<UploadApiResponse>=>{
        console.log("insideee clouddddd");
        
        try {
            const result = await cloudinary.uploader.upload(image,{
                folder:"User-Identification"
            })
            console.log(result,"cloudinaryyyy");
            return result;
            
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error((error as Error).message)
        }
    }
}