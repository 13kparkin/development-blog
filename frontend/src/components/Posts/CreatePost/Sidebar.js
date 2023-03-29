import React from "react";
import "./Sidebar.css";
import { useState } from "react";
import { wordWrap } from "../../../utils/wrapping";

const Sidebar = ({
  posts,
  drafts,
  onAddDraft,
  onAddPosts,
  onDeleteDrafts,
  onDeletePosts,
  activeDrafts,
  activePosts,
  setActiveDrafts,
  setActivePosts,
  createArticleButtonPushed,
  setCreateArticleButtonPushed
}) => {
  const sortedDrafts = drafts?.sort((a, b) => b.lastModified - a.lastModified);


  const [pushedDarft, setPushedDraft] = useState(false);
  const [pushed, setPushed] = useState(false);
  const [pushedDelete, setPushedDelete] = useState({});
  const [activePostClicked, setActivePostClicked] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  const handleDraftButtonClick = () => {
    setPushedDraft(true);
    setCreateArticleButtonPushed(true);
    setTimeout(() => setPushedDraft(false), 200);
    onAddDraft();
  };
  
  const onDeleteButton = (id) => {
    setPushedDelete((prevState) => ({ ...prevState, [id]: true }));
    setTimeout(
      () => setPushedDelete((prevState) => ({ ...prevState, [id]: false })),
      200
    );
    onDeleteDrafts(id);
  };
  const pushedPosts = (id) => {
    setPushed(true);
    setActivePostId(id);
    setActivePostClicked(true);
    setTimeout(() => setPushed(false), 200);
    setTimeout(() => setActivePostClicked(false), 200);
    setActiveDrafts(id)
  };

  

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Articles</h1>
        <button
          className={pushedDarft ? "pushed" : ""}
          onClick={handleDraftButtonClick}
        >
          {createArticleButtonPushed ? "Creating..." : "Create Article"}
        </button>
      </div>
      <div className="app-sidebar-posts-container">
        {sortedDrafts?.map(({ id, title, body, updatedAt }, i) => (
          <>
            <div
              key={i}
              className={`app-sidebar-posts ${id === activePostId ? 'active' : ''} ${id === activePostId && activePostClicked ? 'pushed' : ''}`}
              onClick={() => pushedPosts(id)}
            >
              <span className="sidebar-posts-title">
                <strong>{title && title.substr(0, 20) + "..."}</strong>
              </span>

              <p>{wordWrap(body, 15) && wordWrap(body, 15).substr(0, 50) + "..."}</p>
              <small className="posts-meta">
                Last Modified{" "}
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
            <button
              className={
                pushedDelete[id] ? "pushed delete-button" : "delete-button"
              }
              onClick={(e) => onDeleteButton(id)}
            >
              {pushedDelete[id] ? "Deleting..." : "Delete"}
            </button>
          </>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
