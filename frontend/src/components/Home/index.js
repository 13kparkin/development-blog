import React, {useState, useEffect} from 'react';
import  Markdown  from 'react-markdown';
import './Home.css';


const Home = () => {

  // Create a search box that when you scroll it scrolls up into the header

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const results = searchResults.filter((result) =>
      result.toLowerCase().includes(search)
    );
    setSearchResults(results);
  }, [search]);


  return (
    <div className="home">
        <div className="top-section">
            <div className="top-section-left">
              <div className="top-section-left-header">
              <h1>Welcome to Dev Domain, <br/>Find all things software development.</h1>
            <p>
              Here, you'll find the documentation on projects, tips, and techniques in software development. Stay tuned for updates on cutting-edge technologies, and insights into the skills of Kyle Parkin, and much more.
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
                  {searchResults.map((result) => (
                    <div className="search-history">{result}</div>
                  ))}
                </div>
                </div>

              </div>
            <div className="top-section-right">
              <Markdown className="top-section-right-card">
                

              </Markdown>
              
              </div>
        </div>
        <div className="bottom-section">
            <div className="bottom-section-cards">
              </div>
          </div>
    </div>
  );
};

export default Home;