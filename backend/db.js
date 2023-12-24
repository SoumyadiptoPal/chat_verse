mongoose.set('strictQuery', false);
const uri= process.env.DATABASE_URL;
const connectDB=async()=>{
    try{
        const connectionParams={
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose
        .connect(uri,connectionParams)
        .then(()=>{
            console.log("Connected to Database")
        })
        .catch((e)=>{
            console.log("Error: ", e);
        })
    }catch(err){
        console.log("Failed to connect",err);
    }
}
module.exports=connectDB;