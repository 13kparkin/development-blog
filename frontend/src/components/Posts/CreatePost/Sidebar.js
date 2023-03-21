import React from "react";
import "./sidebar.css";

const Sidebar = ({
    posts,
    onAddPosts,
    onDeletePosts,
    activePosts,
    setActivePosts,
  }) => {
    const sortedPosts = posts.sort((a, b) => b.lastModified - a.lastModified);
  
    return (
      <div className="app-sidebar">
        <div className="app-sidebar-header">
          <h1>Articles</h1>
          <button onClick={onAddPosts}>Create</button>
        </div>
        <div className="app-sidebar-posts">
          {sortedPosts.map(({ id, title, body, lastModified }, i) => (
            <div
              className={`app-sidebar-posts ${id === activePosts && "active"}`}
              onClick={() => setActivePosts(id)}
            >
              <div className="sidebar-posts-title">
                <strong>{title}</strong>
                <button onClick={(e) => onDeletePosts(id)}>Delete</button>
              </div>
  
              <p>{body && body.substr(0, 100) + "..."}</p>
              <small className="posts-meta">
                Last Modified{" "}
                {new Date(lastModified).toLocaleDateString("en-US", {
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