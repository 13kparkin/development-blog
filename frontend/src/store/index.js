import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from './session';
import postsReducer from './posts';
import draftsReducer from './drafts';
import imagesReducer from './images';
import gptReducer from './gpt';
import searchesReducer  from "./searches";
import tagsReducer from "./tags";
import tagsDraftsReducer from "./tagsDrafts";


const rootReducer = combineReducers({
  session: sessionReducer,
  posts: postsReducer,
  drafts: draftsReducer,
  images: imagesReducer,
  getGptMessages: gptReducer,
  searches: searchesReducer,
  tags: tagsReducer,
  tagsDrafts: tagsDraftsReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
