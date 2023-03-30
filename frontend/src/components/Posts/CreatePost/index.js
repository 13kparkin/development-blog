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
import { useHistory } from "react-router-dom";

function CreatePosts() {
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.singlePost);
  const [pushedSave, setPushedSave] = useState(false);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activePosts, setActivePosts] = useState(false);
  const [activeDrafts, setActiveDrafts] = useState(false);
  const [postsByDraftId, setPostsByDraftId] = useState([]);
  const user = useSelector((state) => state.session.user);
  const userId = user?.id;
  const draftObj = useSelector((state) => state.drafts.singleDraft);
  const postsByUserId = useSelector((state) => state.posts.allPostsByUser);
  const postByDraftId = useSelector((state) => state.posts.postsByDraftId);
  const history = useHistory();
  const [ createArticleButtonPushed, setCreateArticleButtonPushed ] = useState(false);
  const [ publishedButtonState, setPublishedButtonState ] = useState("unpublished");
  const [ savedButtonState, setSavedButtonState ] = useState("unsaved");


  if (!user) {
    history.push("/");
  }

  useEffect(() => {
    const getPostsById = async () => {
      const posts = await dispatch(getAllPostsByUser(userId));
      setPosts(posts);
    };
    getPostsById();
    if (activeDrafts) {
      const getPostsbyDraftIdData = async () => {
        const postsByDraftIds = await dispatch(getPostsByDraftId(activeDrafts));
        setPostsByDraftId(postsByDraftIds);
      };
      getPostsbyDraftIdData();
    }
    const getDraftsById = async () => {
      const drafts = await dispatch(getAllDraftsByUser(userId));
      setDrafts(drafts);
    };
    getDraftsById();
  }, [currentPost, activeDrafts]);

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
    setCreateArticleButtonPushed(false);
    setDrafts(drafts);
    return newDrafts;
  };

  const onAddPost = async (savedDraft) => {
    const drafts = await dispatch(getAllDraftsByUser(userId));
    const draftById = drafts.drafts.find(({ id }) => id === activeDrafts);

    const postByDraftIds = await dispatch(getPostsByDraftId(draftById.id));

    setPostsByDraftId(postByDraftIds || []);


    if (postByDraftIds.postByDraftId.length > 0) {
      const newPost = {
        id: postByDraftIds.postByDraftId[0].id,
        title: savedDraft.title,
        body: savedDraft.body,
        userId,
        updatedAt: savedDraft.modifiedAt,
        draftId: draftById.id,
      };
      const editPosts = await dispatch(editPost(newPost));

      setPosts(editPost);
      setPublishedButtonState("published");
      return editPosts;
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
      setPosts(newPosts);
      setPublishedButtonState("published")
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
    // console.log("updatedDraft", updatedDraft)
    // console.log("pushedSave", pushedSave)

    // if (pushedSave) { /// This will be needed for auto saving will come back to..... TODO

      setTimeout(() => setPushedSave(false), 200);
      // const updateDraft = {
      //       title: updatedDraft.title,
      //       description: updatedDraft.description,
      //       body: updatedDraft.body,
      //       updatedAt: updatedDraft.updatedAt,
      //       userId,
      //     };

          const updatedDrafts = await dispatch(editDraft(updatedDraft));
          const drafts = await dispatch(getAllDraftsByUser(userId));
          setTimeout(() => setSaving(false), 2000); 
          setDrafts(drafts);
          setSavedButtonState("saved");
          return updatedDrafts;
    // }else { // Part of auto saving... TODO
    // clearTimeout(timer);
    // timer = setTimeout(async () => {
    //   const updateDraft = {
    //     title: updatedDraft.title,
    //     description: updatedDraft.description,
    //     body: updatedDraft.body,
    //     updatedAt: updatedDraft.updatedAt,
    //     userId,
    //   };
    //   const updateDrafts = await dispatch(editDraft(updatedDraft));
    //   const drafts = await dispatch(getAllDraftsByUser(userId));
    //   setDrafts(drafts);
    //   return updateDrafts;
    
    // }, 5000);
  // }
    
  };

  const onUpdateImage = async (updatedImage) => {
    // clearTimeout(timer);
    // timer = setTimeout(async () => {
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
    // }, 5000);
  };

  // const getActivePosts = () => {
  //   let finalPosts;
  //   let finalDrafts;
  //   if (posts.posts?.length > 0) {
  //     finalPosts = posts.find(({ id }) => id === activePosts);
  //   }
  //   if (drafts.drafts?.length > 0) {
  //     finalDrafts = drafts.find(({ id }) => id === activeDrafts);
  //   }
  //   return finalPosts;
  // };

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
        createArticleButtonPushed={createArticleButtonPushed}
        setCreateArticleButtonPushed={setCreateArticleButtonPushed}
      />
      <Main
        postByDraftId={postByDraftId}
        activeDrafts={getActiveDrafts()}
        onUpdateDrafts={onUpdateDrafts}
        onUpdateImage={onUpdateImage}
        onAddPost={onAddPost}
        onDeletePosts={onDeletePosts}
        pushedSave={pushedSave}
        setPushedSave={setPushedSave}
        setSaving={setSaving}
        saving={saving}
        publishedButtonState={publishedButtonState}
        setPublishedButtonState={setPublishedButtonState}
        savedButtonState={savedButtonState}
        setSavedButtonState={setSavedButtonState}
      />
    </div>
  );
}

export default CreatePosts;
