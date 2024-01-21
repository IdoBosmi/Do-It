import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";


console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

const port = 5000; //process.env.PORT;

// app.listen(port, ()=>{
//     console.log("Server running on port: " + port);
// })



mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
.then(()=>{
    console.log("Mongoose connected...");
    app.listen(port, ()=>{
        console.log("Server running on port: " + port);
    })
})
.catch(console.error)



