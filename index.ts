require("dotenv").config();
import express, { Request, Response } from "express";
import mongoose from "mongoose"; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import productsRoutes from "./routes/productRoutes"

app.use("/api/products",productsRoutes)
 
mongoose.connect(process.env.DATABASE_URL!).then(() => {
  console.log("Product service database connected successfully");
});

app.listen(process.env.PORT||3002, () => {
  console.log("Product service listening on port 3002");
});
