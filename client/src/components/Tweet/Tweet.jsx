import axios from "axios";
import React, { useState, useEffect } from "react";
import formatDistance from "date-fns/formatDistance";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import RepeatIcon from "@mui/icons-material/Repeat";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PostTweet from "./PostTweet";

const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleEdit = () => {
    toggleDropdown();
    setIsEdit(!isEdit);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/tweets/${tweet._id}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    window.location.reload(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/users/find/${tweet.userId}`
        );
        setUserData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [tweet.userId, tweet.likes]);

  useEffect(() => {
    if (userData?.profilePicture?.data) {
      const blob = new Blob(
        [Int8Array.from(userData.profilePicture.data.data)],
        { type: userData.profilePicture.contentType }
      );
      setProfileImage(window.URL.createObjectURL(blob));
    }
  }, [userData]);

  const handleLike = async (e) => {
  e.preventDefault();

  // Optimistic update
  let updatedLikes = tweet.likes.includes(currentUser._id)
    ? tweet.likes.filter((id) => id !== currentUser._id)
    : [...tweet.likes, currentUser._id];

  // Temporarily reflect the change in UI
  setData((prevData) =>
    prevData.map((t) =>
      t._id === tweet._id ? { ...t, likes: updatedLikes } : t
    )
  );

  try {
    await axios.put(
      `http://localhost:8000/api/tweets/${tweet._id}/like`,
      { id: currentUser._id },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err);
  }
};


  const getFirstCharacterUpperCase = (str) => str?.[0]?.toUpperCase() || "";

  return (
    <>
      <div className="p-3 hover:bg-gray-100">
        {userData && (
          <>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <div className="flex items-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full mr-0 border-2 border-slate-800 border-solid"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 bg-blue-500 border-2 border-slate-800 border-solid rounded-full flex items-center justify-center text-white font-bold text-lg mr-0"
                      style={{ fontSize: "15px" }}
                    >
                      {getFirstCharacterUpperCase(userData.username)}
                    </div>
                  )}
                </div>
                <Link to={`/profile/${userData._id}`}>
                  <h3 className="font-bold">{userData.username}</h3>
                </Link>
                <span className="font-normal">@{userData.username}</span>
                <p> • {dateStr}</p>
              </div>

              {userData._id === currentUser._id && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    type="button"
                    className="inline-flex justify-center align-center w-8 h-8 pt-1 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition"
                  >
                    <MoreHorizIcon />
                  </button>

                  {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={toggleEdit}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tweet Text */}
            <p className="mt-2">{tweet.description}</p>

            

            {/* Image or Video Rendering */}
            <div className="mt-3">
              {tweet.imageUrl && (
                <div className="flex justify-center m-2">
                  <img
                    src={tweet.imageUrl}
                    alt="Tweet Media"
                    className="rounded-lg border border-gray-300"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "350px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {tweet.videoUrl && (
                <div className="m-2">
                  <video
                    controls
                    width="100%"
                    height="auto"
                    className="rounded-lg border border-gray-300"
                  >
                    <source src={tweet.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Like Button */}
            {/* Like Button + New Icons */}
<div className="flex justify-between mt-2 text-gray-500">
  {/* Comment */}
  <button className="flex items-center space-x-1 hover:text-blue-500 transition">
    <ChatBubbleOutlineIcon fontSize="small" />
    <span className="text-sm">0</span>
  </button>

  {/* Repost */}
  <button className="flex items-center space-x-1 hover:text-green-500 transition">
    <RepeatIcon fontSize="small" />
    <span className="text-sm">0</span>
  </button>

  {/* Like */}
  <button
    onClick={handleLike}
    className="flex items-center space-x-1 hover:text-red-500 transition"
  >
    {tweet.likes.includes(currentUser._id) ? (
      <FavoriteIcon fontSize="small" className="text-red-500" />
    ) : (
      <FavoriteBorderIcon fontSize="small" />
    )}
    <span className="text-sm">{tweet.likes.length}</span>
  </button>

  {/* Views */}
  <button className="flex items-center space-x-1 hover:text-gray-700 transition">
    <VisibilityIcon fontSize="small" />
    <span className="text-sm">0</span>
  </button>

  {/* Bookmark */}
  <button className="hover:text-yellow-600 transition">
    <BookmarkBorderIcon fontSize="small" />
  </button>
</div>

            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEdit && (
        <div
          className="absolute w-full h-full top-0 left-0 bg-slate-200 bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: "1" }}
        >
          <div className="w-[600px] h-[500px] bg-white rounded-lg border-2 border-gray-400 p-8 flex flex-col gap-4 relative">
            <button
              onClick={toggleEdit}
              className="absolute top-3 right-3 text-lg px-3 py-2 hover:bg-gray-200 rounded-full cursor-pointer"
            >
              ✖
            </button>
            <h2 className="font-bold text-xl">Edit Tweet</h2>
            <hr />
            <PostTweet
              description={tweet.description}
              tweetId={tweet._id}
              furl={tweet.imageUrl || tweet.videoUrl}
              ftype={tweet.imageUrl ? "image" : tweet.videoUrl ? "video" : ""}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Tweet;
