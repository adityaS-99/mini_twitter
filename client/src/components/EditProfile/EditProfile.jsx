import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { changeProfile, logout } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

// import {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";

// import app from "../../firebase";

const EditProfile = ({ setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [img, setImg] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImg(file);
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    
    if (!img) {
      return;
    }

    const formData = new FormData();
    formData.append("imageData", img);

    try {
      const response = await axios.post(`https://twitter-backend-jd7u.onrender.com/api/image/upload/userpic/${currentUser._id}`, formData);
      changeProfile(response.data.imageData);
      console.log(response.data.message);
      window.location.reload(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async () => {
    const deleteProfile = await axios.delete(`https://twitter-backend-jd7u.onrender.com/api/users/${currentUser._id}`);
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-slate-200 bg-opacity-50 flex items-center justify-center">
      <div className="w-[600px] h-[500px] bg-white rounded-lg border-2 border-gray-400 p-8 flex flex-col gap-4 relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 flex items-center mr-2 text-lg px-3 py-2 hover:bg-gray-200 rounded-full cursor-pointer"
        >
          ✖
        </button>
        <h2 className="font-bold text-xl">Edit Profile</h2>
        <hr />
          <form onSubmit={handleImageSubmit}>
            <label className="block mb-2">Choose a new profile picture</label>
            <input
              type="file"
              className="bg-transparent border border-slate-500 rounded p-2"
              accept="image/*"
              onChange={handleImageChange}
              required
              />
            <button type='submit' className="ml-3 px-4 py-1 text-base text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Upload</button>
          </form>

        <p>Delete Account</p>
        <button
          className="bg-red-500 text-white py-2 rounded-full"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
