import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { getSinglePost, getAllPosts } from "../../store/posts";
import { createSearch, getSearchHistory, getSearchHistoryByUser } from "../../store/searches";
import { useHistory } from "react-router-dom";
import SearchResults from "../Search";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import "./Home.css";

const Home = () => {
  const wrapperRef = useRef(null);
  const [search, setSearch] = useState("");
  // const [newLimitedArray, setNewLimitedArray] = useState([]);
  const [counter, setCounter] = useState(0);
  const [searchHistoryActive, setSearchHistoryActive] = useState(false);
  const [searchesActive, setSearchesActive] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const allPostsArray = useSelector((state) => state.posts.allPosts?.posts);
  const searchHistoryArray = useSelector(
    (state) => state.searches.searchHistory
  );
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  let timer;

  // This function sorts the posts in the allPostsArray by the date they were updated, newest to oldest and returns the first post in the array.
  function newestPostFunction() {
    const newestPostArray = allPostsArray?.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return newestPostArray?.[0];
  }

  const newestPost = newestPostFunction();

  function newest5Posts() {
    const newest5PostsArray = allPostsArray?.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return newest5PostsArray?.slice(0, 6);
  }

  const newLimitedArray = newest5Posts();


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const getAllPostsData = async () => {
      const posts = await dispatch(getAllPosts());
      return posts;
    };
    getAllPostsData();

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        searchHistoryActiveFalse();
      }
    }
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, dispatch, user, ]);


  const handleArticleClick = () => {
    return history.push(`/posts/${newestPost?.id}`);
  };

  const handleArticleCardClick = (id) => {
    return history.push(`/posts/${id}`);
  };

  const handleClickSearch = (e) => {
    e.preventDefault();
    setSearchHistoryActive(true);
    setSearchesActive(true);
    dispatch(getSearchHistoryByUser(user.id));
  };
  function searchHistoryActiveFalse() {
    setSearchHistoryActive(false);
  }

  const handleSearchCreate = (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    const searchObj = {
      searchHistory: search,
      userId: user.id,
    };
    setSearchHistoryActive(false);
    dispatch(createSearch(searchObj));
  };

  const date = new Date(newestPost?.updatedAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  if (!newestPost) {
    return null;
  }

  // if (newLimitedArray?.length > 6) {
  //   const newPostArray = allPostsArray?.slice(0, 6);
  //   setNewLimitedArray([...newPostArray]);
  // }

  const newPostArrayLength = newLimitedArray?.length;
  const limitedPostsView = newLimitedArray?.length + 6;

  // This function handles the click event for the "More Posts" button. It will slice the allPostsArray and return the next 6 posts. todo: need to add this
  // function handleMorePostsClick() {
  //   const newPostArray = allPostsArray?.slice(
  //     newPostArrayLength,
  //     limitedPostsView
  //   );
  //   setNewLimitedArray(newPostArray, ...newPostArray);
  // }

  

  // if (newLimitedArray?.length === 0 && counter < 5) { // This is the reason the cards are not rerendering...
  //   setNewLimitedArray(allPostsArray);
  //   setCounter(counter + 1);
  // }

  function handSearchHistoryOnclick(result) {
    return () => {
      setSearch(result);
    };
  }

  return (
    <div className="home">
      <div id="top" className="top-section">
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
          <form onSubmit={(e) => handleSearchCreate(e)} className="search-box">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearchChange}
              onClick={(e) => handleClickSearch(e)}
            />
            {searchHistoryActive &&
              loggedIn &&
              Object.values(searchHistoryArray)?.[0]?.history && (
                <div ref={wrapperRef} className="search-history-container">
                  {Object.values(searchHistoryArray)?.map((result) => (
                    <div
                      key={`${result?.id}`}
                      onClick={handSearchHistoryOnclick(result?.history)}
                      className="search-history"
                    >
                      {result?.history && (
                        <div className="search-history-text">
                          {result?.history}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            <div className="searchResults">
              <SearchResults
                setSearchesActive={setSearchesActive}
                searchesActive={searchesActive}
                searchTerm={search}
              />
            </div>
          </form>
        </div>
        <div className="top-section-right">
          <div className="top-section-right-card">
            <div
              className="home-top-right-section-card-content"
              onClick={(e) => handleArticleClick()}
            >
              <div className="home-content-card-box">
                <div className="home-preview-image">
                  <ReactMarkdown className="home-preview-image">
                    {newestPost?.PostsImages?.[0]?.url}
                  </ReactMarkdown>
                </div>
                <div className="home-preview-user">
                  {newestPost?.User?.username}
                </div>
                <div className="home-saved-date">{`Updated on ${month}, ${day}`}</div>
                <h1 className="home-preview-title">{newestPost?.title}</h1>
                <div className="home-markdown-preview-body">
                  <div className="home-markdown-preview-body">
                    <ReactMarkdown
                      className="home-markdown-preview-top-card"
                      children={newestPost?.body}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={atomDark} // theme
                              language={match[1]}
                              PreTag="section" // parent tag
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="bottom" className="bottom-section">
        <div id="articles" className="bottom-section-card-header">
          <h1>Articles</h1>
        </div>
        <div className="bottom-section-cards">
          {newLimitedArray?.map((post) => (
            <div
              key={post.id}
              onClick={(e) => handleArticleCardClick(post.id)}
              className="bottom-section-card"
            >
              <div className="bottom-section-card-img">
                <ReactMarkdown>{post?.PostsImages?.[0]?.url}</ReactMarkdown>
              </div>
              <div className="bottom-section-card-title">
                <h1>{post?.title}</h1>
              </div>
              <div className="bottom-section-card-body">
                <ReactMarkdown
                  className="home-markdown-preview-bottom-cards"
                  children={post?.body}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, "")}
                          style={atomDark} // theme
                          language={match[1]}
                          PreTag="section" // parent tag
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
