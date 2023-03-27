import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { searchPosts } from '../../store/posts';
import ReactMarkdown from 'react-markdown';
import './Search.css';

function SearchResults({ searchTerm }) {
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    
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
      return () => {
        clearTimeout(timerId);
      };
    }, [searchTerm, dispatch]);

    return (
      <>
        <div className="search-results-cards">
        {results?.map(result => (
          <>
          <div className="search-results-card">
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
      </>
    );
  }

export default SearchResults;