import React, { useEffect, useState } from "react";
import TimelineTweet from "../TimelineTweet/TimelineTweet";

import { useSelector } from "react-redux";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { storage } from "../../firebase";
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';

const PostTweet = ({description='', tweetId='', furl='', ftype=''})=>{
    const [tweetText, setTweetText] = useState(description);

    const { currentUser } = useSelector((state) => state.user);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [fileURL, setFileURL] = useState('');
    const [fileType, setFileType] = useState('');
    const [msg, setmsg] = useState('');
    const [selectedImage, setSelectedImage] = useState(ftype==='image'?furl:null);
    const [selectedVideo, setSelectedVideo] = useState(ftype==='video'?furl:null);
    const [isSubmit, setIsSubmit] = useState(0);
    // console.log('filetype',ftype);
    // console.log('url', furl);
    // console.log('image:', selectedImage);
    // console.log('video:', selectedVideo);
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (file.type.startsWith('image/')) {
          setSelectedImage(reader.result);
          setImage(file);
          setFileType('image');
          // setmsg(file.name);
          setVideo(null);
          setSelectedVideo(null);
        } else if (file.type.startsWith('video/')) {
          setSelectedVideo(reader.result);
          setVideo(file);
          setFileType('video');
          // setmsg(file.name);
          setImage(null);
          setSelectedImage(null);
        } else {
          setmsg('unsupported file type');
          event.target = null;
        }
      };
      reader.readAsDataURL(file);
    }
  };

useEffect(()=>{
    const handle = async ()=>{
        // const body = {
        //     userId: currentUser._id,
        //     description: tweetText,
        //     url: fileURL===''?furl:fileURL,
        //     type: fileType===''?ftype:fileType,
        // }

        if(tweetId===''){
            await axios.post("https://twitter-backend-jd7u.onrender.com/api/tweets", {
                userId: currentUser._id,
                description: tweetText,
                url: fileURL===''?furl:fileURL,
                type: fileType===''?ftype:fileType,
            }, { withCredentials: true }).then(response => {
                // if(response.status==200){

                    console.log(response.data);
                // }
                // else{
                //     console.
                // }
            }).catch(err=>{
                console.log(err);
            });
        }
        else{
            console.log('!going to update');
            await axios.put(`https://twitter-backend-jd7u.onrender.com/api/tweets/${tweetId}`, {
                userId: currentUser._id,
                description: tweetText,
                url: fileURL===''?furl:fileURL,
                type: fileType===''?ftype:fileType,
            }, { withCredentials: true }).then(response => {
                    console.log(response.data);
            }).catch(err=>{
                console.log(err);
            });
        }
        // console.log('after file url', fileURL);
        window.location.reload(false);
        //   setIsSubmit(false);
    } 
        
    if((isSubmit == 2 && fileURL!=='') || isSubmit==1){
    // if((selectedImage || selectedVideo)&& fileURL){
        console.log('file url', fileURL);
        handle();
    }
  }, [fileURL, isSubmit]);

  const uploadFile = async () => {
    if (!fileType){
        setIsSubmit(1);
        return;
    } 
    const fileRef = ref(storage, `${fileType}/${currentUser._id + new Date().toString()}`);
    await uploadBytes(fileRef, fileType=='image'?image:video).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('image uploaded, url: ', url);
        setFileURL(url);
        setIsSubmit(2);
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!tweetText && !image && !video){
      console.log('nothing selected');
      return;
    } 
    try {
        await uploadFile();
    } catch (err) {
        console.log(err);
    }
  };

  return(
    <>
        <form className="border-b-2 pb-6">
            <textarea
                onChange={(e) => setTweetText(e.target.value)}
                type="text"
                placeholder="What's happening"
                maxLength={300}
                value = {tweetText}
                className="bg-slate-200 rounded-lg w-full h-[120px] p-2"
            ></textarea>

            <label htmlFor={`media${tweetId}`} className="cursor-pointer mr-4">
                <PermMediaSharpIcon fontSize="small"/>
            </label>
            <input
                id={`media${tweetId}`}
                type="file"
                style={{ display: 'none' }}
                className="display-none bg-transparent border border-slate-500 rounded p-2"
                accept="image/*, video/*"
                onChange={handleFileChange}
            />
            {msg !=='' && <div className="m-2">{msg}</div>}
            
            <button
                onClick={handleSubmit}
                className=" px-5 py-2 text-base text-white bg-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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