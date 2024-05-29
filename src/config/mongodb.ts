import mongoose,{connect} from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDb=async()=>{
    try{
        const url=process.env.mongodb
        if(!url) throw new Error, 'MONGODB_URI is not defined in environment variables'
        await mongoose.connect(url);
        console.log("mongodb connected");
    }catch(err){
        console.log(err);
    }
}

export default connectDb;