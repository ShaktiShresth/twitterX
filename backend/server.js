import express from "express";
import dotenv from "dotenv";

import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log("Twitter/X's server is running on port:", PORT);
  connectMongoDB();
});
