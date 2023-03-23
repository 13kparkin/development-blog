import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDraft, getAllDraftsByUser, deleteDraft, editDraft, getSingleDraft} from "../../../store/drafts";
import "./Main.css";

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
  const imageUrl = useSelector((state) => state.drafts);
  const userId = user?.id;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const error = {};
  const newImageUrl = imageUrl.singleDraft?.draft?.PostsImages[0].url;






  useEffect(() => {

    const getDraftsById = async () => {
      const drafts = await dispatch(getSingleDraft(activeDrafts.id));
    
      setUrl(newImageUrl);

      return drafts;
    };
    getDraftsById();
    setTitle(activeDrafts?.title);
    setBody(activeDrafts?.body);
  }, [activeDrafts, newImageUrl]);

  if (!activeDrafts)
    return <div className="no-active-posts">No Active Articles</div>;

    const convertImageUrlToMarkdown = (url) => {
      if (url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i) != null) {
        return `![Image](${url})`;
      } else {
        return error.error = "Please enter a valid image URL";
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
          autoFocus
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
        <div className="img-url">
          {activeDrafts && activeDrafts.PostsImages?.url}
        </div>
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
