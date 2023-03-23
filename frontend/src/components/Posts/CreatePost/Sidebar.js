import React from "react";
import "./Sidebar.css";

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


    console.log(activeDrafts)
  
    return (
      <div className="app-sidebar">
        <div className="app-sidebar-header">
          <h1>Articles</h1>
          {activeDrafts && (
            <button onClick={() => onAddPosts(activeDrafts)}>Publish</button>
          )}
          <button onClick={onAddDraft}>Create Article</button>
        </div>
        <div className="app-sidebar-posts">
          {sortedDrafts?.map(({ id, title, body, updatedAt }, i) => (
            <div
              key={i}
              className={`app-sidebar-posts ${id === activePosts && "active"}`}
              onClick={() => setActiveDrafts(id)}
            >
              <div className="sidebar-posts-title">
                <strong>{title && title.substr(0,20) + "..."}</strong>
                <button onClick={(e) => onDeleteDrafts(id)}>Delete</button>
              </div>
  
              <p >{body && body.substr(0, 50) + "..."}</p>
              <small className="posts-meta">
                Last Modified{" "}
                {new Date(updatedAt).toLocaleDateString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Sidebar;



  
