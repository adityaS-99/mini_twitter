import React, { useEffect, useState } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";

import { useSelector } from "react-redux";
import axios from "axios";
import { supabase } from "../../supabase"; // Make sure this points to your supabase.js
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';

const PostTweet = ({ description = '', tweetId = '', furl = '', ftype = '' }) => {
  const [tweetText, setTweetText] = useState(description);

  const { currentUser } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [fileType, setFileType] = useState('');
  const [msg, setMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState(ftype === 'image' ? furl : null);
  const [selectedVideo, setSelectedVideo] = useState(ftype === 'video' ? furl : null);
  const [isSubmit, setIsSubmit] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          setSelectedImage(reader.result);
          setImage(file);
          setFileType('image');
          setVideo(null);
          setSelectedVideo(null);
        } else if (file.type.startsWith('video/')) {
          setSelectedVideo(reader.result);
          setVideo(file);
          setFileType('video');
          setImage(null);
          setSelectedImage(null);
        } else {
          setMsg('Unsupported file type');
          event.target.value = null;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handle = async () => {
      const payload = {
        userId: currentUser._id,
        description: tweetText,
        url: fileURL === '' ? furl : fileURL,
        type: fileType === '' ? ftype : fileType,
      };

      try {
        if (tweetId === '') {
          const response = await axios.post("http://localhost:8000/api/tweets", payload, { withCredentials: true });
          console.log(response.data);
        } else {
          const response = await axios.put(`http://localhost:8000/api/tweets/${tweetId}`, payload, { withCredentials: true });
          console.log(response.data);
        }
      } catch (err) {
        console.log(err);
      }

      // window.location.reload(false);
      setTweetText('');
      setImage(null);
      setVideo(null);
      setSelectedImage(null);
      setSelectedVideo(null);
      setIsSubmit(0);
    }

    if ((isSubmit === 2 && fileURL !== '') || isSubmit === 1) {
      handle();
    }
  }, [fileURL, isSubmit]);

  const uploadFile = async () => {
    if (!fileType) {
      setIsSubmit(1);
      return;
    }

    const file = fileType === 'image' ? image : video;
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser._id}_${Date.now()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('tweets-media')
      .upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      return;
    }
    console.log('File uploaded successfully:', data);

    // Get public URL
    const { data: publicData, error: urlError } = supabase
    .storage
    .from('tweets-media')
    .getPublicUrl(fileName);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return;
    }

      console.log("✅ Public URL:", publicData.publicUrl);
      setFileURL(publicData.publicUrl);
      setIsSubmit(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweetText && !image && !video) {
      console.log('Nothing selected');
      return;
    }
    try {
      await uploadFile();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form className="border-b-2 pb-6">
        <textarea
          onChange={(e) => setTweetText(e.target.value)}
          placeholder="What's happening"
          maxLength={300}
          value={tweetText}
          className="bg-slate-200 rounded-lg w-full h-[120px] p-2"
        ></textarea>

        <label htmlFor={`media${tweetId}`} className="cursor-pointer mr-4">
          <PermMediaSharpIcon fontSize="small" />
        </label>
        <input
          id={`media${tweetId}`}
          type="file"
          style={{ display: 'none' }}
          accept="image/*, video/*"
          onChange={handleFileChange}
        />
        {msg !== '' && <div className="m-2">{msg}</div>}

        <button
          onClick={handleSubmit}
          className="px-5 py-2 text-base text-white bg-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Post
        </button>
      </form>

      <div>
        {selectedImage && (
          <div className="flex justify-center m-2">
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          </div>
        )}
        {selectedVideo && (
          <div className="m-2">
            <video controls width="100%" height="auto">
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </>
  )
};

export default PostTweet;
