import React, { useEffect, useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const ExploreTweets = () => {
  const [explore, setExplore] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const exploreTweets = await axios.get("http://localhost:8000/api/tweets/explore");
        setExplore(exploreTweets.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchData();
  }, [currentUser._id]);
  return (
    <div className="overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hidden">
      <div className="mt-6 divide-y divide-gray-300 divide-dashed hover:divide-solid">
      {explore &&
        explore.map((tweet) => {
          return (
            <div key={tweet._id} className="pt-2 pb-2 pr-2">
              <Tweet tweet={tweet} setData={setExplore} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreTweets;
