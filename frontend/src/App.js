import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import CreatePosts from "./components/Posts/CreatePost";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import SinglePost from "./components/Posts/SinglePost";
import "./index.css"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/posts/new">
            <CreatePosts />
          </Route>
          <Route path="/posts/:postId">
            <SinglePost />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;