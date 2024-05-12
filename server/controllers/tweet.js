import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";

export const createTweet = async (req, res, next) => {
  // console.log(req.body);
  const newTweet = new Tweet({
    userId: req.body.userId,
    description: req.body.description || '',
    imageUrl: req.body.type==='image'?req.body.url:'',
    videoUrl: req.body.type==='video'?req.body.url:''
  });
  try {
    // return res.status(200).json({msg:'hi'});
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    res.status(500).json(err);
    handleError(500, err);
  }
};
export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    // if (tweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    // } else {
    //   handleError(500, err);
    // }
  } catch (err) {
    handleError(500, err);
  }
};

export const editTweet = async (req, res) => {
  const tweetId = req.params.id;

  try {
    // Find the tweet by its ID
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found.' });
    }

    // Update tweet properties based on request body
    tweet.description = req.body.description || tweet.description;
    tweet.imageUrl = req.body.type === 'image' ? req.body.url : '';
    tweet.videoUrl = req.body.type === 'video' ? req.body.url : '';

    // Save the updated tweet
    const updatedTweet = await tweet.save();

    res.status(200).json(updatedTweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating tweet.' });
  }
};


export const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return Tweet.find({ userId: followerId });
      })
    );

    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getUserTweets = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createAt: -1,
    });

    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getExploreTweets = async (req, res) => {
  try {
    const exploreTweets = await Tweet.find({ likes: { $exists: true } }).sort({
      likes: -1,
    });

    res.status(200).json(exploreTweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching explore tweets.' });
    handleError(500, err);
  }
};
