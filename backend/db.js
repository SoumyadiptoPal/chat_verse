const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
const server='127.0.0.1:27017';
const database='ChatVerse';
const connectDB=async()=>{
    try{
        await mongoose.connect(`mongodb://${server}/${database}`);
        console.log("MongoDB connected");
    }catch(err){
        console.log("Failed to connect",err);
    }
}
module.exports=connectDB;