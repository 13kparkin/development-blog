import ReactMarkdown from "react-markdown";

const Main = ({ activePosts, onUpdatePosts }) => {
  const onEditField = (field, value) => {
    onUpdatePosts({
      ...activePosts,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  if (!activePosts) return <div className="no-active-note">No Active Articles</div>;

  return (
    <div className="posts-main">
      <div className="posts-main-edit">
        <input
          type="text"
          id="title"
          placeholder="Article Title"
          value={activePosts.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your article here..."
          value={activePosts.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
      </div>
      <div className="posts-main-preview">
        <h1 className="preview-title">{activePosts.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activePosts.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Main;