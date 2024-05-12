import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  editTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} from "../controllers/tweet.js";
import multer from "multer";

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

// Create a Tweet
router.post("/", createTweet);

// Delete a Tweet
router.delete("/:id", deleteTweet);

// Edit a Tweet
router.put("/:id", editTweet);

// Like or Dislike a Tweet
router.put("/:id/like", likeOrDislike);

// get all timeline tweets
router.get("/timeline/:id", getAllTweets);

// get user Tweets only
router.get("/user/all/:id", getUserTweets);

//explore
router.get("/explore", getExploreTweets);
export default router;
