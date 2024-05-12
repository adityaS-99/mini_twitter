import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      max: 280,
    },
    likes: {
      type: Array,
      defaultValue: [],
    },
    imageUrl:{
      type:String,
      default:''
    },
    videoUrl:{
      type:String,
      default:'',
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", TweetSchema);
