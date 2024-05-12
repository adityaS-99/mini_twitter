import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../../firebase";
import React, { useState } from "react";
import formatDistance from "date-fns/formatDistance";

import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import PostTweet from "./PostTweet";

const Tweet = ({ tweet, setData }) => {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(tweet);
  const [userData, setUserData] = useState(null);

  const dateStr = formatDistance(new Date(tweet.createdAt), new Date());
  const location = useLocation().pathname;
  const { id } = useParams();
  const [profileImage, setprofileImage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleEdit = ()=>{
    toggleDropdown();
    setIsEdit(!isEdit);
  }

  const handleDelete = async () => {
    // Implement your delete logic here
    try{
      const response = await axios.delete(`https://twitter-backend-jd7u.onrender.com/api/tweets/${tweet._id}`, {
        withCredentials:true
      });
    } catch(err){
      console.log(err);
    }
    window.location.reload(false)
    // Close the dropdown if needed: setIsDropdownOpen(false);
  };

  // console.log(location);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const findUser = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/users/find/${tweet.userId}`);

        setUserData(findUser.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [tweet.userId, tweet.likes]);

  useEffect(()=>{
    if(userData !== null && userData.profilePicture.data !==null){
      // console.log(userProfile);
      const blob = new Blob([Int8Array.from(userData.profilePicture.data.data)], {type: userData.profilePicture.contentType });
      setprofileImage(window.URL.createObjectURL(blob));
    }
  }, [userData]);

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const like = await axios.put(`https://twitter-backend-jd7u.onrender.com/api/tweets/${tweet._id}/like`, {
        id: currentUser._id,
      });

      if (location.includes("profile")) {
        const newData = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/tweets/user/all/${id}`);
        setData(newData.data);
      } else if (location.includes("explore")) {
        const newData = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/tweets/explore`);
        setData(newData.data);
      } else {
        const newData = await axios.get(`https://twitter-backend-jd7u.onrender.com/api/tweets/timeline/${currentUser._id}`);
        setData(newData.data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  function getFirstCharacterUpperCase(inputString) {
    if (typeof inputString === "string" && inputString.length > 0) {
      return inputString.charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  return (<>
    <div className='p-3 hover:bg-gray-100'>
      {/* <hr className="mb-2"></hr> */}
      {userData && (
        <>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              {/* <img src="" alt="" /> */}
              <div className="flex items-center">
                {profileImage !== '' ?(
                  <img
                    src={profileImage}
                    alt="Profile Picture"
                    className="w-8 h-8 rounded-full mr-0 border-2 border-slate-800 border-solid"
                    style={{objectFit:'cover'}}
                  />
                ):(
                  <div className="w-8 h-8 bg-blue-500 border-2 border-slate-800 border-solid rounded-full flex items-center justify-center text-white font-bold text-lg mr-0" style={{fontSize:'15px'}}>
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
            <div className="relative inline-block text-left">
              {userData._id===currentUser._id && (<div>
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="inline-flex justify-center align-center w-8 h-8 pt-1 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition"
                  id="options-menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  <MoreHorizIcon />
                </button>
              </div>)}

              {isDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu-button"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                    <button onClick={toggleEdit} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                      Edit
                    </button>
                    <button onClick={handleDelete} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p>{tweet.description}</p>
          <button onClick={handleLike}>
            {tweet.likes.includes(currentUser._id) ? (
              <FavoriteIcon className="mr-2 my-2 cursor-pointer"></FavoriteIcon>
            ) : (
              <FavoriteBorderIcon className="mr-2 my-2 cursor-pointer"></FavoriteBorderIcon>
            )}
            {tweet.likes.length}
          </button>
          <div>
            {tweet.imageUrl && (<div className="flex justify-center m-2">
              <img src={tweet.imageUrl} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>)}
            {tweet.videoUrl && (
              <div className="m-2">
                <video controls width="100%" height="auto">
                  <source src={tweet.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </>
      )}
    </div>
    {isEdit && (
      <div className="absolute w-full h-full top-0 left-0 bg-slate-200 bg-opacity-50 flex items-center justify-center" style={{zIndex:'1'}}>
        <div className="w-[600px] h-[500px] bg-white rounded-lg border-2 border-gray-400 p-8 flex flex-col gap-4 relative">
          <button
            onClick={toggleEdit}
            className="absolute top-3 right-3 flex items-center mr-2 text-lg px-3 py-2 hover:bg-gray-200 rounded-full cursor-pointer"
          >
            ✖
          </button>
          <h2 className="font-bold text-xl">Edit Tweet</h2>
          <hr />
            <PostTweet 
            description={tweet.description} 
            tweetId={tweet._id} 
            furl={tweet.imageUrl===''?tweet.videoUrl:tweet.imageUrl}
            ftype={tweet.imageUrl===''?(tweet.videoUrl===''?'':'video'):'image'}/>
            {/* <form onSubmit={handleEdit}>
              <textarea
                onChange={(e) => setTweetText(e.target.value)}
                value={tweetText}
                type="text"
                placeholder="What's happening"
                maxLength={300}
                className="bg-slate-200 rounded-lg w-full p-2"
              ></textarea>
              <label htmlFor="media1" className="cursor-pointer mr-4">
                <PermMediaSharpIcon fontSize="small"/>
              </label>
              <input
                id='media1'
                type="file"
                style={{ display: 'none' }}
                className="display-none bg-transparent border border-slate-500 rounded p-2"
                accept="image/*, video/*"
                onChange={handleFileChange}
              />
              {msg !=='' && <div className="m-2">{msg}</div>}
              <button type='submit' className="ml-3 px-4 py-1 text-base text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Save</button>
            </form>
            <div>
              {selectedImage && (<div className="flex justify-center m-2">
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>)}
              {selectedVideo && (
                <div className="m-2">
                  <video controls width="100%" height="auto">
                    <source src={selectedVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div> */}
        </div>
      </div>
    )}
    </>
  );
};

export default Tweet;
