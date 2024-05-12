import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";
import imageRoutes from "./routes/image.js";

import cors from 'cors';

const app = express();
dotenv.config();

const connect = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("connect to mongodb database");
    })
    .catch((err) => {
      throw err;
    });
};
var corsOptions = {
  origin: 'https://twitter-clone-1135.netlify.app',
  // origin:'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/image", imageRoutes);

app.listen(8000, () => {
  connect();
  console.log("Listening to port 8000");
});
