import "dotenv/config";
//import mongoose from "mongoose";
import app from "./app";


app.listen(5000, ()=>{
    console.log("Server running on port: " + 5000);
})

//const port = process.env.PORT;

/*
mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
.then(()=>{
    console.log("Mongoose connected...");
    app.listen(port, ()=>{
        console.log("Server running on port: " + port);
    })
})
.catch(console.error)
*/


