import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { searchPosts } from '../../store/posts';
import './Search.css';

function SearchResults({ searchTerm }) {
    const [results, setResults] = useState([]);
    
    useEffect(() => {
      async function fetchData() {
        const searchResults = await searchPosts(searchTerm);
        setResults(searchResults);
      }
      fetchData();
    }, [searchTerm]);
    return (
      <ul>
        {results.map(result => (
          <li key={result.id}>
            {result.name}: {result.description}
          </li>
        ))}
      </ul>
    );
  }

export default SearchResults;