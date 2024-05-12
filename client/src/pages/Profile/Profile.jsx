import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import EditProfile from "../../components/EditProfile/EditProfile";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Tweet from "../../components/Tweet/Tweet";

import { following } from "../../redux/userSlice";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [userTweets, setUserTweets] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [image, setImage] = useState('');
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const setProfile = async (data)=>{
      setUserProfile(data);
    }
    const fetchData = async () => {
      try {
        const tweets = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/tweets/user/all/${id}`);
        const profile = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/users/find/${id}`);

        setUserTweets(tweets.data);
        await setProfile(profile.data);
        // console.log(profile.data);
        // console.log("fg1hj",userProfile);

      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();

  }, [currentUser, id]);
  
  useEffect(()=>{
    if(userProfile !== null && userProfile.profilePicture.data !==null){
      // console.log(userProfile);
      const blob = new Blob([Int8Array.from(userProfile.profilePicture.data.data)], {type: userProfile.profilePicture.contentType });
      setImage(window.URL.createObjectURL(blob));
    }
  }, [userProfile]);

  const handleFollow = async () => {
    if (!currentUser.following.includes(id)) {
      try {
        const follow = await axios.put(`https://twitter-backend-jd7u.onrender.com/api/users/follow/${id}`, {
          id: currentUser._id,
        });
        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    } else {
      try {
        const unfollow = await axios.put(`https://twitter-backend-jd7u.onrender.com/api/users/unfollow/${id}`, {
          id: currentUser._id,
        });

        dispatch(following(id));
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  function getFirstCharacterUpperCase(inputString) {
    if (typeof inputString === "string" && inputString.length > 0) {
      return inputString.charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-8">
        <div className="px-7 col-span-2">
          <LeftSidebar />
        </div>
        <div className="col-span-4 border-x-2 border-t-slate-800 px-6">
        {userProfile && (<>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {image !== '' ?(
                <img
                  src={image}
                  alt="Profile Picture"
                  className="w-20 h-20 rounded-full mr-2 border-2 border-slate-800 border-solid"
                  style={{objectFit:'cover'}}
                />
              ):(
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-2" style={{fontSize:'30px'}}>
                  {getFirstCharacterUpperCase(userProfile.username)}
                </div>
              )}
              <span className="text-gray-700 text-lg font-bold" style={{fontSize:'20px'}}>
                {userProfile.username}
              </span>
            </div>

            {currentUser._id === id ? (
              <button
                // className="px-4 py-2 bg-blue-500 rounded-full text-white"
                className="px-4 py-1 text-base text-black-600 font-semibold rounded-full border border-black-200 hover:bg-gray-200 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                onClick={() => setOpen(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 rounded-full text-white"
                onClick={handleFollow}
              >
                {currentUser.following.includes(id)?'Following':'Follow'}
              </button>
            )}
          </div>
          <div className="flex flex-col text-gray-700 mt-4 text-sm">
            <div>
              <span className="mr-2">
                {userProfile.followers.length} Followers 
              </span>
              <span>
                {userProfile.following.length} Following
              </span>
            </div>
          </div>
          <div className="mt-4 mb-2 font-bold font-lg text-gray-600">Tweets</div>
          <div className="overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hidden">
            <div className=" divide-y divide-gray-300 divide-solid hover:divide-solid">
            {userTweets.length===0?(<div> No Tweets</div>):(
              userTweets.map((tweet) => {
                return (
                  <div className="pt-2 pb-2 pr-2" key={tweet._id}>
                    <Tweet tweet={tweet} setData={setUserTweets} />
                  </div>
                );
              }))}
            </div>
          </div>
          </>)}
        </div>
        <div className="px-6 col-span-2">
          <RightSidebar />
        </div>
      </div>
      {open && <EditProfile setOpen={setOpen} />}
    </>
  );
};

export default Profile;
