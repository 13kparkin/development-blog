import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { searchPosts } from '../../store/posts';
import ReactMarkdown from 'react-markdown';

import './Search.css';

function SearchResults({ searchTerm, setSearchesActive, searchesActive }) {
    const wrapperRef = useRef(null);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleArticleCardClick = (id) => {
      return history.push(`/posts/${id}`);
    };
    
    useEffect(() => {
      let timerId;
      async function fetchData() {
        const searchResults = await dispatch(searchPosts(searchTerm));
        setResults(searchResults.results);
      }
      if (searchTerm) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          fetchData();
        }, 2000);
      }
      if (searchTerm.length === 0) {
        setResults([]);
      }
      if (results?.length > 0) {
        setSearchesActive(true);
      }


      function handleClickOutside(event) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setSearchesActive(false)
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        clearTimeout(timerId);
      };

      
    }, [searchTerm, dispatch, wrapperRef]);

    return (
      <>
      {results?.length > 0 && searchesActive && ( 
      <div ref={wrapperRef} className="search-results-box">
        <div  className="search-results-cards">
        {results?.map(result => (
          <>
          <div className="search-results-card" onClick={(e) => handleArticleCardClick(result?.id)}>
          <div className="search-results-card-img">
            <ReactMarkdown>
              {`${result?.imageUrl}`}
            </ReactMarkdown>
          </div>
          <div className="search-results-card-title" key={result?.id}>
            <h1>
            {result?.title}
            </h1>
          </div>
          <div className="search-results-card-body">
            <ReactMarkdown>
              {`${result?.body}`}
            </ReactMarkdown>
          </div>
          </div>
          </>
        ))}
        </div>
      </div>
      )}
      </>
    );
  }

export default SearchResults;