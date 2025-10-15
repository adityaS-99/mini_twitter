import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import Tweet from "../Tweet/Tweet";

const TimelineTweet = () => {
  const [timeLine, setTimeLine] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineTweets = await axios.get(
          `http://localhost:8000/api/tweets/timeline/${currentUser._id}`
        );
        console.log(timelineTweets.data);

        setTimeLine(timelineTweets.data);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [currentUser._id]);

  // console.log("Timeline", timeLine);
  return (
    <div className="mt-6 divide-y divide-gray-300 divide-dashed hover:divide-solid" >
      {timeLine &&
        timeLine.map((tweet) => {
          return (
            <div key={tweet._id} className="pt-2 pb-2 pr-2">
              <Tweet tweet={tweet} setData={setTimeLine} />
            </div>
          );
        })}
    </div>
  );
};

export default TimelineTweet;
