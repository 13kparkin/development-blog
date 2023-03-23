import React from "react";
import "./Sidebar.css";
import { useState } from "react";

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
}) => {
  const sortedDrafts = drafts?.sort((a, b) => b.lastModified - a.lastModified);

  const [pushed, setPushed] = useState(false);
  const [pushedDarft, setPushedDraft] = useState(false);
  const [pushedPublished, setPushedPublished] = useState(false);
  const [pushedDelete, setPushedDelete] = useState({});

  const handleDraftButtonClick = () => {
    setPushedDraft(true);
    setTimeout(() => setPushedDraft(false), 200);
    onAddDraft();
  };
  const handlePublishButtonClick = () => {
    setPushedPublished(true);
    setTimeout(() => setPushedPublished(false), 200);
    onAddPosts();
  };
  const onDeleteButton = (id) => {
    setPushedDelete((prevState) => ({ ...prevState, [id]: true }));
  setTimeout(() => setPushedDelete((prevState) => ({ ...prevState, [id]: false })), 200);
  onDeleteDrafts(id);
  };

  

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Articles</h1>
        {activeDrafts && (
          <button className={pushedPublished ? "pushed" : ""} onClick={() => onAddPosts(handlePublishButtonClick)}>Publish</button>
        )}
        <button className={pushedDarft ? "pushed" : ""} onClick={handleDraftButtonClick}>Create Article</button>
      </div>
      <div className="app-sidebar-posts">
        {sortedDrafts?.map(({ id, title, body, updatedAt }, i) => (
          <>
          <div
            key={i}
            className={`app-sidebar-posts ${id === activePosts && "active"}`}
            onClick={() => setActiveDrafts(id)}
          >
            <div className="sidebar-posts-title">
              <strong>{title && title.substr(0, 20) + "..."}</strong>
            </div>
            

            <p>{body && body.substr(0, 50) + "..."}</p>
            <small className="posts-meta">
              Last Modified{" "}
              {new Date(updatedAt).toLocaleDateString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
            
          </div>
          <button className={pushedDelete[id] ? "pushed delete-button" : "delete-button"} onClick={(e) => onDeleteButton(id)}>Delete</button>
          </>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
