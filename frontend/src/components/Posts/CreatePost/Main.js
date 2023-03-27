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

const Main = ({
  activeDrafts,
  onUpdateDrafts,
  onUpdateImage,
  onAddPost,
  postByDraftId,
  onDeletePosts
}) => {
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

  // console.log(Object.values(postsByDraftId).length);

  const [pushedPublished, setPushedPublished] = useState(false);
  const [pushedPublishedWithDelete, setPushedPublishedWithDelete] = useState(false);
  const [pushedDelete, setPushedDelete] = useState({});
  const user = useSelector((state) => state.session.user);
  const imageUrl = useSelector((state) => state.drafts);
  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const error = {};
  let newImageUrl = imageUrl.singleDraft?.draft?.PostsImages?.[0].url;
  const postId = postByDraftId?.postByDraftId?.[0]?.id

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

  if (!activeDrafts)
    return <div className="no-active-posts">No Active Articles</div>;

  const convertImageUrlToMarkdown = (url) => {
    // Check if the URL is already in Markdown format
    if (url.match(/^!\[.*\]\(.*\.(jpeg|jpg|gif|png)(\?.*)?\)$/i) != null) {
      return url;
      // Check if the URL is a valid image URL
    } else if (url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i) != null) {
      return `![Image](${url})`;
      // If the URL is not a valid image URL or not in markdown, return an error
    } else {
      return (error.error = "Please enter a valid image URL");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onEditField("title", e.target.value);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    onEditField("body", e.target.value);
  };

  const handleUrlChange = (e) => {
    const imageUrl = e.target.value;
    const markdown = convertImageUrlToMarkdown(imageUrl);
    setUrl(imageUrl);


    if (error.error) {
      return;
    } else {
      onEditImage("img", markdown);
    }
  };

  const date = new Date(activeDrafts.updatedAt);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  return (
    <div className="app-main">
      <div className="app-main-posts-edit">
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
      </div>
      <div className="app-main-posts-preview">
        <ReactMarkdown className="preview-image">{url}</ReactMarkdown>
        <div className="preview-user">{user?.username}</div>
        <div className="saved-date">{`Updated on ${month}, ${day}`}</div>
        <h1 className="preview-title">{title}</h1>
        <ReactMarkdown className="markdown-preview">
          {body}
        </ReactMarkdown>
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
