import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createDraft,
  getAllDraftsByUser,
  deleteDraft,
  editDraft,
  getSingleDraft,
} from "../../../store/drafts";
import "./Main.css";
import { wordWrap } from "../../../utils/wrapping";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Main = ({
  activeDrafts,
  onUpdateDrafts,
  onUpdateImage,
  onAddPost,
  postByDraftId,
  onDeletePosts,
  pushedSave,
  setPushedSave,
}) => {
  const onEditTitleField = (titleField, bodyField, { title, body }) => {
    onUpdateDrafts({
      ...activeDrafts,
      [titleField]: title,
      [bodyField]: body,
      updatedAt: Date.now(),
    });
  };
  const onEditImage = (field, value) => {
    onUpdateImage({
      [field]: value,
      draftId: activeDrafts.id,
    });
  };

  // console.log(Object.values(postsByDraftId).length);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [urlError, setUrlError] = useState([]);
  const [pushedPublished, setPushedPublished] = useState(false);
  const [pushedPublishedWithDelete, setPushedPublishedWithDelete] =
    useState(false);
  const [pushedDelete, setPushedDelete] = useState(false);
  const [tag, setTag] = useState("");
  const user = useSelector((state) => state.session.user);
  const imageUrl = useSelector((state) => state.drafts);
  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const dispatch = useDispatch();
  const error = {};
  let invalidUrl = [];
  let newImageUrl = imageUrl.singleDraft?.draft?.PostsImages?.[0].url;
  const postId = postByDraftId?.postByDraftId?.[0]?.id;

  useEffect(() => {
    const getDraftsById = async () => {
      const drafts = await dispatch(getSingleDraft(activeDrafts?.id));

      setUrl(newImageUrl);

      return drafts;
    };
    getDraftsById();
    setTitle(activeDrafts?.title);
    setBody(activeDrafts?.body);
  }, [activeDrafts, newImageUrl]);

  const handlePublishButtonClick = () => {
    setPushedPublished(true);
    setTimeout(() => setPushedPublished(false), 200);
    onAddPost();
  };

  const onDeletePostsButton = (id) => {
    setPushedDelete((prevState) => ({ ...prevState, [id]: true }));
    setTimeout(
      () => setPushedDelete((prevState) => ({ ...prevState, [id]: false })),
      200
    );
    onDeletePosts(id);
  };

  const handleSaveButtonClick = async (e) => {
    const imageUrl = url;
    setUrlError([]);
    if (imageUrl.startsWith("![Image](") && imageUrl.endsWith(")")) {
      setMarkdown(imageUrl);
      setTitle(e.target.value);
      setBody(e.target.value);
      const savedDraft = {
        title,
        body,
      };
      setPushedSave(true);
      onEditTitleField("title", "body", savedDraft);
      onEditImage("img", imageUrl);
      return;
    }
    convertImageUrlToMarkdown(imageUrl, (markdown) => {
      if (urlError.length === 0) {
        setMarkdown(markdown);
        setTitle(e.target.value);
        setBody(e.target.value);
        const savedDraft = {
          title,
          body,
        };
        setPushedSave(true);
        onEditTitleField("title", "body", savedDraft);
        onEditImage("img", markdown);
      }
    });
  };

  if (!activeDrafts)
    return <div className="no-active-posts">No Active Articles</div>;

  const convertImageUrlToMarkdown = (url, callback) => {
    const img = new Image();
    img.src = url;

    img.onerror = () => {
      callback(url);
      setUrlError(["Please enter a valid image URL"]);
    };

    img.onload = () => {
      const validUrl = `![Image](${url})`;
      callback(validUrl);
    };
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    // onEditField("title", e.target.value);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    // onEditField("body", e.target.value);
  };

  const handleUrlChange = (e) => {
    const imageUrl = e.target.value;
    // const markdown = convertImageUrlToMarkdown(imageUrl);
    setUrl(imageUrl);
    // if (error.error) {
    //   return;
    // } else {
    //   onEditImage("img", markdown);
    // }
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const date = new Date(activeDrafts.updatedAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  return (
    <div className="app-main">
      <div className="app-main-posts-edit">
        {urlError.length > 0 &&
          urlError.map((error) => (
            <div className="error-message-url">{error}</div>
          ))}
        <input
          type="text"
          className="img-url"
          id="img"
          placeholder="Cover Image"
          value={url}
          onChange={handleUrlChange}
        />
        <input
          type="text"
          className="title"
          id="title"
          placeholder="Article Title"
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
        <textarea
          id="body"
          className="body"
          placeholder="Write your article here..."
          value={body}
          onChange={handleBodyChange}
        />
        <input
          type="text"
          className="tags"
          id="tag"
          placeholder="Tags"
          value={tag}
          onChange={handleTagChange}
          autoFocus
        />
      </div>
      <button
        className={pushedSave ? "pushed-saved" : "save-button"}
        onClick={handleSaveButtonClick}
      >
        Save
      </button>
      <div className="app-main-posts-preview">
        <ReactMarkdown className="preview-image">{url}</ReactMarkdown>
        <div className="preview-user">{user?.username}</div>
        <div className="saved-date">{`Updated on ${month}, ${day}`}</div>
        <h1 className="preview-title">{title}</h1>
        <ReactMarkdown
          className="markdown-preview"
          children={body}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomDark} // theme
                  language={match[1]}
                  PreTag="section" // parent tag
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
        <>
          {postByDraftId?.postByDraftId?.length < 1 && (
            <button
              className={pushedPublished ? "pushed" : ""}
              onClick={() => onAddPost(handlePublishButtonClick)}
            >
              Publish
            </button>
          )}
          {postByDraftId?.postByDraftId?.length > 0 && (
            <>
              <button
                className={pushedPublished ? "pushed" : ""}
                onClick={() => onDeletePostsButton(postId)}
              >
                Delete
              </button>

              <button
                className={pushedPublishedWithDelete ? "pushed" : ""}
                onClick={() => onAddPost(handlePublishButtonClick)}
              >
                Publish
              </button>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Main;
