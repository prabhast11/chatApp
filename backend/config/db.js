const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false);
const connectDB = async () =>{
    try {
        // console.log("My output",process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true
   })

   console.log(`MongoDB Connected to ${conn.connection.host}`)
    } 
    catch (error) {
        console.log(`Error : ${error.message}`)   
        process.exit()
    }
} 

module.exports = connectDB