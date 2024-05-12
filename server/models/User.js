import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileProfile: { type: String },
    followers: { type: Array, defaultValue: [] },
    following: { type: Array, defaultValue: [] },
    description: { type: String },
    profilePicture: {
      data: {
        type: Buffer,
        default: null,
      }, // Store the image data as Buffer
      contentType: {
        type: String,
        default:'',
      }, // Store the content type of the image (e.g., "image/jpeg")
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
