import React from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import MainTweet from "../../components/MainTweet/MainTweet";
import RightSidebar from "../../components/RightSidebar/RightSidebar";
import Signin from "../Signin/Signin";

import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {!currentUser ? (
        <Signin />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-8">
          <div className="px-7 col-span-2">
            <LeftSidebar />
          </div>
          <div className="col-span-4 border-x-2 border-t-slate-800 px-6">
            <MainTweet />
          </div>
          <div className="px-6 col-span-2">
            <RightSidebar />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
