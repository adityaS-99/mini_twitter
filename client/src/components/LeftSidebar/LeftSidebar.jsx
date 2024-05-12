import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";

const LeftSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState('');
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(()=>{
    if(currentUser !== null && currentUser.profilePicture.data !==null){
      // console.log(userProfile);
      const blob = new Blob([Int8Array.from(currentUser.profilePicture.data.data)], {type: currentUser.profilePicture.contentType });
      setImage(window.URL.createObjectURL(blob));
    }
  }, [currentUser]);

  function getFirstCharacterUpperCase(inputString) {
    if (typeof inputString === "string" && inputString.length > 0) {
      return inputString.charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  return (
    <div className="flex flex-col h-full md:h-[80vh] justify-between mr-6">
      <div className="mt-6 flex flex-col space-y-4">
        <Link to="/">
          <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
            <HomeIcon fontSize="large" />
            <p>Home</p>
          </div>
        </Link>
        <Link to="/explore">
          <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
            <TagIcon fontSize="large" />
            <p>Explore</p>
          </div>
        </Link>
        <Link to={`/profile/${currentUser._id}`}>
          <div className="flex items-center space-x-6 px-2 py-2 hover:bg-slate-200 rounded-full cursor-pointer">
            <PersonIcon fontSize="large" />
            <p>Profile</p>
          </div>
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="flex items-center">
            {image !== '' ?(
              <img
                src={image}
                alt="Profile Picture"
                className="w-12 h-12 rounded-full mr-0 border-2 border-slate-800 border-solid"
                style={{objectFit:'cover'}}
              />
            ):(
              <div className="w-12 h-12 bg-blue-500 border-2 text-lg border-slate-800 border-solid rounded-full flex items-center justify-center text-white font-bold text-lg mr-0" >
                {getFirstCharacterUpperCase(currentUser.username)}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold">{currentUser.username}</p>
            <p className="font-bold">@{currentUser.username}</p>
          </div>
        </div>
        <div>
          <Link to="signin">
            <button
              className="bg-red-500 px-4 py-2 text-white rounded-full"
              onClick={handleLogout}
            >
              Logout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
