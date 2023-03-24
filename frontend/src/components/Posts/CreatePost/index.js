import { useEffect, useState } from "react";
import "./CreatePost.css";
import Main from "./Main";
import Sidebar from "./Sidebar";
import {
  createPost,
  deletePost,
  editPost,
  getSinglePost,
  getAllPostsByUser,
  getPostsByDraftId,
} from "../../../store/posts";
import { createSingleImage, updateSingleImage } from "../../../store/images";
import {
  createDraft,
  getAllDraftsByUser,
  deleteDraft,
  editDraft,
  getSingleDraft,
} from "../../../store/drafts";
import { useDispatch, useSelector } from "react-redux";

function CreatePosts() {
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.singlePost);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activePosts, setActivePosts] = useState(false);
  const [activeDrafts, setActiveDrafts] = useState(false);
  const [postsByDraftId, setPostsByDraftId] = useState(false);
  const user = useSelector((state) => state.session.user);
  const userId = user?.id;
  const draftObj = useSelector((state) => state.drafts.singleDraft);
  const postsByUserId = useSelector((state) => state.posts.allPostsByUser);
  const postByDraftId = useSelector((state) => state.posts.postsByDraftId);


  useEffect(() => {
    const getPostsById = async () => {
      const posts = await dispatch(getAllPostsByUser(userId));
      setPosts(posts);
    };
    getPostsById();
    const getDraftsById = async () => {
      const drafts = await dispatch(getAllDraftsByUser(userId));
      setDrafts(drafts);
    };
    getDraftsById();
  }, [currentPost]);

  const onAddDraft = async () => {
    const newDraft = {
      title: "Untitled Article",
      description: "",
      body: "",
      userId,
    };

    const newDrafts = await dispatch(createDraft(newDraft));
    const newImage = {
      draftId: newDrafts.newDraft.id,
      url: "",
    };
    const newImages = await dispatch(
      createSingleImage(newDrafts.newDraft.id, newImage)
    );
    const drafts = await dispatch(getAllDraftsByUser(userId));
    setDrafts(drafts);
    return newDrafts;
  };

  const onAddPost = async () => {
    const drafts = await dispatch(getAllDraftsByUser(userId));
    const draftById = drafts.drafts.find(({ id }) => id === activeDrafts);

    const postByDraftIds = await dispatch(getPostsByDraftId(draftById.id));

    if (Object.values(postByDraftIds).length > 0) {
      return;
    } else {
      const newPost = {
        title: draftById.title,
        description: draftById.description,
        body: draftById.body,
        userId,
        updatedAt: draftById.updatedAt,
        draftId: draftById.id,
      };
      const newPosts = await dispatch(createPost(newPost));
      return newPosts;
    }
  };

  const onDeleteDrafts = async (draftId) => {
    const deleteDrafts = await dispatch(deleteDraft(draftId));
    const drafts = await dispatch(getAllDraftsByUser(userId));
    setActiveDrafts(false);
    setDrafts(drafts);
    return deleteDrafts;
  };

  const onDeletePosts = async (postId) => {
    const deletePosts = await dispatch(deletePost(postId));
    setPosts(posts);
    return deletePosts;
  };

  let timer;
  const onUpdateDrafts = async (updatedDraft) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const updateDraft = {
        title: updatedDraft.title,
        description: updatedDraft.description,
        body: updatedDraft.body,
        updatedAt: updatedDraft.updatedAt,
        userId,
      };
      const updateDrafts = await dispatch(editDraft(updatedDraft));
      const drafts = await dispatch(getAllDraftsByUser(userId));
      setDrafts(drafts);
      return updateDrafts;
    }, 3000);
  };

  const onUpdateImage = async (updatedImage) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const updateImage = {
        draftId: updatedImage.draftId,
        url: updatedImage.img,
      };

      const updateImages = await dispatch(
        updateSingleImage(updatedImage.draftId, updateImage)
      );

      const drafts = await dispatch(getAllDraftsByUser(userId));
      setDrafts(drafts);
      return updateImages;
    }, 3000);
  };

  const getActivePosts = () => {
    let finalPosts;
    let finalDrafts;
    if (posts.posts?.length > 0) {
      finalPosts = posts.find(({ id }) => id === activePosts);
    }
    if (drafts.drafts?.length > 0) {
      finalDrafts = drafts.find(({ id }) => id === activeDrafts);
    }
    return finalPosts;
  };

  const getActiveDrafts = () => {
    let finalDrafts;
    if (drafts.drafts?.length > 0) {
      finalDrafts = drafts.drafts.find(({ id }) => id === activeDrafts);
    }
    return finalDrafts;
  };

  return (
    <div className="create-posts">
      <Sidebar
        posts={posts.posts}
        drafts={drafts.drafts}
        onAddDraft={onAddDraft}
        onAddPost={onAddPost}
        onDeleteDrafts={onDeleteDrafts}
        onDeletePosts={onDeletePosts}
        activeDrafts={activeDrafts}
        activePosts={activePosts}
        setActiveDrafts={setActiveDrafts}
        setActivePosts={setActivePosts}
      />
      <Main
        activeDrafts={getActiveDrafts()}
        onUpdateDrafts={onUpdateDrafts}
        onUpdateImage={onUpdateImage}
        onAddPost={onAddPost}
      />
    </div>
  );
}

export default CreatePosts;
