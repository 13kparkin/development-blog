import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";


const Main = ({ activeDrafts, onUpdateDrafts }) => {
  const onEditField = (field, value) => {
    onUpdateDrafts({
      ...activeDrafts,
      [field]: value,
      updatedAt: Date.now(),
    });
  };

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");


  useEffect(() => {

      setTitle(activeDrafts?.title);
      setBody(activeDrafts?.body);
    
  }, [activeDrafts]);

  


  if (!activeDrafts) return <div className="no-active-posts">No Active Articles</div>;





  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onEditField("title", e.target.value);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    onEditField("body", e.target.value);
  };

  return (
    <div className="posts-main">
      <div className="posts-main-edit">
        <input
          type="text"
          id="title"
          placeholder="Article Title"
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your article here..."
          value={body}
          onChange={handleBodyChange}
        />
      </div>
      <div className="posts-main-preview">
        <h1 className="preview-title">{activeDrafts.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeDrafts.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;