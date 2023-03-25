import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePost, getAllPosts } from "../../store/posts";
import { useHistory } from "react-router-dom";

import "./Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const dispatch = useDispatch();
  const allPostsArray = useSelector((state) => state.posts.allPosts?.posts);
  const history = useHistory();

  // This function sorts the posts in the allPostsArray by the date they were updated, newest to oldest and returns the first post in the array.
  function newestPostFunction() {
    const newestPostArray = allPostsArray?.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return newestPostArray?.[0];
  }

  const newestPost = newestPostFunction();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const results = searchHistory.filter((result) =>
      result.toLowerCase().includes(search)
    );
    setSearchHistory(results);
    const getAllPostsData = async () => {
      const posts = await dispatch(getAllPosts());
    };
    getAllPostsData();
  }, [search]);

  const handleArticleClick = () => {
    return history.push(`/posts/${newestPost?.id}`);
  };
    

  console.log(newestPost) // This is the newest post in the database. delete when done developping/debugging.

  const date = new Date(newestPost?.updatedAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  if (!newestPost) {
    return null;
  }

  return (
    <div className="home">
      <div className="top-section">
        <div className="top-section-left">
          <div className="top-section-left-header">
            <h1>
              Welcome to Dev Domain, <br />
              Find all things software development.
            </h1>
            <p>
              Here, you'll find the documentation on projects, tips, and
              techniques in software development. Stay tuned for updates on
              cutting-edge technologies, and insights into the skills of Kyle
              Parkin, and much more.
            </p>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleChange}
            />
            <div className="search-history">
              {searchHistory.map((result) => (
                <div className="search-history">{result}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="top-section-right">
          <div className="top-section-right-card" onClick={handleArticleClick}>
            <div className="home-top-right-section-card-content">
            <div className="home-content-card-box">
            <div className="home-preview-image">
            <ReactMarkdown className="home-preview-image">{newestPost?.PostsImages?.[0]?.url}</ReactMarkdown>
            </div>
            <div className="home-preview-user">{newestPost?.User?.username}</div>
            <div className="home-saved-date">{`Updated on ${month}, ${day}`}</div>
            <h1 className="home-preview-title">{newestPost.title}</h1>
            <div className="home-markdown-preview-body">
            <ReactMarkdown className="home-markdown-preview">{newestPost.body}</ReactMarkdown>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <div className="bottom-section-cards"></div>
      </div>
    </div>
  );
};

export default Home;
