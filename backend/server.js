import  express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import seedRouter from "./routes/seedRoutes.js";
import ProductRouter from "./routes/productRoutes.js";


const PORT = process.env.PORT || 5000;
dotenv.config();

mongoose.connect(process.env.MongoURI).then(()=> {
    console.log('connected to db');
}).catch(err => {
    console.log(err.message);
})
const app = express();

app.use('/api/seed', seedRouter)
app.use('/api/products', ProductRouter)


app.listen(PORT,() => {
    console.log(`Server up and running on port ${PORT}`);
})