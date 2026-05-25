import express from "express";
import dotenv from "dotenv";

import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Twitter/X's server is running on port:", PORT);
  connectMongoDB();
});
