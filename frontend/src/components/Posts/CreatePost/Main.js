import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleDraft } from "../../../store/drafts";
import "./Main.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getAllTags, deleteTag } from "../../../store/tags";

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
  const disabled = true; // change this when ready to add tags
  const wrapperRef = useRef(null);
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
  const allTagsArray = useSelector((state) => state.tags.allTags.tags);
  const [tagsActive, setTagsActive] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTagArray, setNewTagArray] = useState([]);
  const dispatch = useDispatch();
  let newImageUrl = imageUrl.singleDraft?.draft?.PostsImages?.[0].url;
  const postId = postByDraftId?.postByDraftId?.[0]?.id;
  let publishButtonText;
  let saveButtonText;

  useEffect(() => {
    const getDraftsById = async () => {
      if (activeDrafts){
      const drafts = await dispatch(getSingleDraft(activeDrafts?.id));

      setUrl(newImageUrl);

      return drafts;
      }
    };
    getDraftsById();
    const getTagsData = async () => {
      const tags = await dispatch(getAllTags());
      setNewTagArray(allTagsArray)
      return tags;
    };
    getTagsData();

    setTitle(activeDrafts?.title);
    setBody(activeDrafts?.body);
  }, [activeDrafts, newImageUrl]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setTagsActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

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
      saveButtonText = "Save as Draft";
      break;
    case "saving":
      saveButtonText = "Saving...";
      break;
    case "saved":
      saveButtonText = "Draft Saved";
      break;
    default:
      saveButtonText = "Save as Draft";
  }

  const handlePublishButtonClick = (e) => {
    setPushedPublished(true);
    setPublishedButtonState("publishing");
    setTimeout(() => setPushedPublished(false), 200);
    const imageUrl = url;
    setUrlError([]);
    if (!imageUrl.startsWith("![Image](") && !imageUrl.endsWith(")")) {
      console.log('[test')
      setUrlError(["Please make sure image is in markdown format or click save to draft to auto convert ie. ![Image](https://i.imgur.com/1J2J3X4.png)"]);
      return;
    }

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
      onAddPost(savedDraft);
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
        onAddPost(savedDraft);
      }
    });
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

    try {
      const markdown = await convertImageUrlToMarkdown(imageUrl);
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
      return;
    } catch (error) {
      setUrlError([error]);
    }
  };

  if (!activeDrafts)
    return <div className="no-active-posts">No Active Articles</div>;

  const convertImageUrlToMarkdown = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;

      img.onerror = () => {
        setUrlError(["Please enter a valid image URL"]);
        reject("Please enter a valid image URL");
      };

      img.onload = () => {
        const validUrl = `![Image](${url})`;
        setUrlError([]);
        resolve(validUrl);
      };
    });
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

  const handleTagfieldClick = () => {
    setTagsActive(true);
  };

  const handleTagClick = async (tag) => {
    setTag((prevTag) => prevTag + (prevTag ? ', ' : '') + tag.tag);
    setNewTagArray((prevArray) => prevArray.filter((t) => t.tag !== tag.tag));
  };

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
          placeholder={disabled ? "Tags coming soon" : "Add Tags"}
          value={tag}
          onChange={handleTagChange}
          onClick={handleTagfieldClick}
          disabled={true}
          autoFocus
        />
        {tagsActive && newTagArray.length > 0 && (
          <div ref={wrapperRef} className="tags-container">
            {newTagArray.map((tags) => (
              <div
                key={`${tags?.id}`}
                onClick={(e) => handleTagClick(tags)}
                className="tags-text"
              >
                #{tags?.tag}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        className={`save-button ${pushedSave ? "pushed-saved" : ""} ${
          clickedSave ? "loading-save" : ""
        }`}
        onClick={handleSaveButtonClick}
        disabled={
          saveButtonText === "Saving..." || saveButtonText == "Draft Saved"
        }
      >
        <div className="save-button-loading">{saveButtonText}</div>
      </button>
      <>
        {postByDraftId?.postByDraftId?.length < 1 && (
          <button
            className={
              pushedPublished
                ? "preview-publish-button-non-pushed"
                : "preview-publish-button-non-pushed"
            }
            onClick={(e) => handlePublishButtonClick(e)}
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
              disabled={
                publishedButtonState === "Published" ||
                publishedButtonState === "Publishing..."
              }
            >
              {pushedDelete ? "Setting..." : "Set to Private"}
            </button>

            <button
              className={
                pushedPublished
                  ? "preview-publish-button-pushed"
                  : "preview-publish-button-pushed"
              }
              onClick={(e) => handlePublishButtonClick(e)}
              disabled={
                publishButtonText === "Published" ||
                publishButtonText === "Publishing..."
              }
            >
              {publishButtonText}
            </button>
          </>
        )}
      </>

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
      </div>
    </div>
  );
};

export default Main;




