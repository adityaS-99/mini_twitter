import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account"));
  }
};
export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.params;
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete all tweets with userId matching the deleted user.
    await Tweet.deleteMany({ userId: userToDelete._id }, { session });

    await userToDelete.remove();

    await User.updateMany(
      { _id: { $in: userToDelete.followers } },
      { $pull: { followers: userId } },
      { session }
    );

    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { following: userId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'User and associated tweets deleted successfully.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    return res.status(500).json({ message: 'Error deleting user and associated tweets.' });
  }
};

export const follow = async (req, res, next) => {
  try {
    //user
    const user = await User.findById(req.params.id);
    //current user
    const currentUser = await User.findById(req.body.id);

    if (!user.followers.includes(req.body.id)) {
      await user.updateOne({
        $push: { followers: req.body.id },
      });

      await currentUser.updateOne({ $push: { following: req.params.id } });
    } else {
      res.status(403).json("you already follow this user");
    }
    res.status(200).json("following the user");
  } catch (err) {
    next(err);
  }
};
export const unFollow = async (req, res, next) => {
  try {
    //user
    const user = await User.findById(req.params.id);
    //current user
    const currentUser = await User.findById(req.body.id);

    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        $pull: { followers: req.body.id },
      });

      await currentUser.updateOne({ $pull: { following: req.params.id } });
    } else {
      res.status(403).json("you are not following this user");
    }
    res.status(200).json("unfollowing the user");
  } catch (err) {
    next(err);
  }
};
