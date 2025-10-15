import React, { useEffect, useState } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";
import { useSelector } from "react-redux";
import PostTweet from "../Tweet/PostTweet";

const MainTweet = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState('');

  useEffect(() => {
    if (currentUser?.profilePicture?.data) {
      const blob = new Blob(
        [Int8Array.from(currentUser.profilePicture.data.data)], 
        { type: currentUser.profilePicture.contentType }
      );
      setImage(window.URL.createObjectURL(blob));
    }
  }, [currentUser]);

  const getFirstCharacterUpperCase = (str) => str?.[0]?.toUpperCase() || "";

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hidden">
      {currentUser && (
        <div className="flex items-center mb-2">
          {image ? (
            <img
              src={image}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full mr-0 border-2 border-slate-800 border-solid"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-12 h-12 bg-blue-500 border-2 text-lg border-slate-800 border-solid rounded-full flex items-center justify-center text-white font-bold mr-0">
              {getFirstCharacterUpperCase(currentUser.username)}
            </div>
          )}
        </div>
      )}

      <PostTweet />
      <TimelineTweet />
    </div>
  );
};

export default MainTweet;
