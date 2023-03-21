import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./createPosts.css";
import Main from "./Main";
import Sidebar from "./Sidebar";
import { createPost, deletePost, editPost } from "../../../store/posts";
import { useDispatch, useSelector } from "react-redux";

function CreatePosts() {
  const dispatch = useDispatch();
  const currentPost = useSelector((state) => state.posts.singlePost);
  const [posts, setPosts] = useState([]);
  const [activePosts, setActivePosts] = useState(false);

  useEffect(() => {
    setPosts(currentPost);
  }, [currentPost]);


  const onAddPost = () => {
    const newPost = {
      id: uuid(),
      title: "Untitled Article",
      body: "",
      updatedAt: Date.now(),
    };
    dispatch(createPost(newPost));
  };

  const onDeletePost = (postId) => {
    dispatch(deletePost(postId));
  };

  const onUpdatePost = (updatedPost) => {
    const updatePosts = {
        ...posts,
    }
    dispatch(editPost(updatePosts));
  };

  const getActivePosts = () => {
    return posts.find(({ id }) => id === activeNote);
  };

  return (
    <div className="create-posts">
      <Sidebar
        notes={notes}
        onAddNote={onAddPosts}
        onDeleteNote={onDeletePosts}
        activeNote={activePosts}
        setActiveNote={setActivePosts}
      />
      <Main activeNote={getActivePosts()} onUpdateNote={onUpdatePosts} />
    </div>
  );
}

export default CreatePosts;
