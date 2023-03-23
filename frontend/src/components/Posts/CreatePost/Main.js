import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import './Main.css'

const Main = ({ activeDrafts, onUpdateDrafts, onUpdateImage }) => {
  const onEditField = (field, value) => {
    onUpdateDrafts({
      ...activeDrafts,
      [field]: value,
      updatedAt: Date.now(),
    });
  };
  const onEditImage = (field, value) => {
    onUpdateImage({
      [field]: value,
      draftId: activeDrafts.id,
    });
  };


  const user = useSelector((state) => state.session.user);
  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");



  useEffect(() => {
    setTitle(activeDrafts?.title);
    setBody(activeDrafts?.body);
  }, [activeDrafts]);

  if (!activeDrafts)
    return <div className="no-active-posts">No Active Articles</div>;

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onEditField("title", e.target.value);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    onEditField("body", e.target.value);
  };
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    onEditImage("img", e.target.value);
  };

  return (
    <div className="app-main">
      <div className="app-main-posts-edit">
      <input
          type="text"
          id="img"
          placeholder="Cover Image"
          value={url}
          onChange={handleUrlChange}
          autoFocus
        />
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
      <div className="app-main-posts-preview">
         <div className="img-url">{activeDrafts && activeDrafts.PostsImages?.url}</div> 
        <div className="preview-user">{user?.username}</div>
        <h1 className="preview-title">{activeDrafts.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeDrafts.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;
