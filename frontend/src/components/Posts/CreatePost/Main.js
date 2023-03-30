import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleDraft,
} from "../../../store/drafts";
import "./Main.css";
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
  setSaving,
  saving,
  publishedButtonState,
  setPublishedButtonState,
  setSavedButtonState,
  savedButtonState,
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


  const [urlError, setUrlError] = useState([]);
  const [pushedPublished, setPushedPublished] = useState(false);
  const [clickedSave, setClickedSave] = useState(false);
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
  let newImageUrl = imageUrl.singleDraft?.draft?.PostsImages?.[0].url;
  const postId = postByDraftId?.postByDraftId?.[0]?.id;
  let publishButtonText;
  let saveButtonText;

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

  switch (publishedButtonState) {
    case "unpublished":
      publishButtonText = "Publish";
      break;
    case "publishing":
      publishButtonText = "Publishing...";
      break;
    case "published":
      publishButtonText = "Published";
      break;
    default:
      publishButtonText = "Publish";
  }

  switch (savedButtonState) {
    case "unsaved":
      saveButtonText = "Save";
      break;
    case "saving":
      saveButtonText = "Saving...";
      break;
    case "saved":
      saveButtonText = "Saved";
      break;
    default:
      saveButtonText = "Save";
  }

  const handlePublishButtonClick = () => {
    setPushedPublished(true);
    setPublishedButtonState("publishing");
    setTimeout(() => setPushedPublished(false), 200);
    onAddPost();

    
    
  };

  const onDeletePostsButton = (id) => {
    setPushedDelete((prevState) => ({ ...prevState, [id]: true }));
    setTimeout(
      () => setPushedDelete((prevState) => ({ ...prevState, [id]: false })),
      200
    );
    setTimeout(() => setPushedDelete(false), 200);
    onDeletePosts(id);
  };

  const handleSaveButtonClick = async (e) => {
    const imageUrl = url;
    setUrlError([]);
    if (imageUrl.startsWith("![Image](") && imageUrl.endsWith(")")) {
      setMarkdown(imageUrl);
      setSavedButtonState("saving");
      setTitle(e.target.value);
      setBody(e.target.value);
      const savedDraft = {
        title,
        body,
        modifiedAt: Date.now(),
      };
      setSaving(true);
      setPushedSave(true);
      setClickedSave(true);
      setTimeout(() => {
        setClickedSave(false);
      }, 3000);
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
          modifiedAt: Date.now(),
        };
        setSaving(true);
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
    setSavedButtonState("unsaved");
    setPublishedButtonState("unpublished");
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setSavedButtonState("unsaved");
    setPublishedButtonState("unpublished");
  };

  const handleUrlChange = (e) => {
    const imageUrl = e.target.value;
    setSavedButtonState("unsaved");
    setPublishedButtonState("unpublished");

    setUrl(imageUrl);

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
        className={`save-button ${pushedSave ? "pushed-saved" : ""} ${
          clickedSave ? "loading-save" : ""
        }`}
        onClick={handleSaveButtonClick}
        disabled={saveButtonText === "Saving..." || saveButtonText == "Saved"}
      >
        <div className="save-button-loading">
          {saveButtonText}
        </div>
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
              className={
                pushedPublished
                  ? "preview-publish-button-pushed"
                  : "preview-publish-button-non-pushed"
              }
              onClick={handlePublishButtonClick}
            >
              {pushedPublished ? "Publishing..." : "Publish"}
            </button>
          )}
          {postByDraftId?.postByDraftId?.length > 0 && (
            <>
              <button
                className={
                  pushedDelete
                    ? "preview-delete-button-pushed"
                    : "preview-delete-button-non-pushed"
                }
                onClick={() => onDeletePostsButton(postId)}
                disabled={publishedButtonState === "Published" || publishedButtonState === "Publishing..."}
              >
                {pushedDelete ? "Deleting..." : "Delete"}
              </button>

              <button
                className={
                  pushedPublished
                    ? "preview-publish-button-pushed"
                    : "preview-publish-button-non-pushed"
                }
                onClick={handlePublishButtonClick}
                disabled={publishButtonText === "Published" || publishButtonText === "Publishing..."}
              >
                {publishButtonText}
              </button>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Main;
