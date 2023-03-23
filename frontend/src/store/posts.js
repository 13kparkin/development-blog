import { csrfFetch } from './csrf';

const SET_SINGLE_POST = 'posts/setSinglePost';
const SET_ALL_POSTS = 'posts/setAllPosts';
const REMOVE_POST = 'posts/removePost';
const SET_ALL_POSTS_BY_USER = 'posts/setAllPostsByUser';

const setAllPosts = (posts) => ({
    type: SET_ALL_POSTS,
    payload: posts,
});
const setSinglePost = (post) => ({
    type: SET_SINGLE_POST,
    payload: post,
});
const removePost = () => ({
    type: REMOVE_POST,
});
const setAllPostsByUser = (posts) => ({
    type: SET_ALL_POSTS_BY_USER,
    payload: posts,
});


// Get all posts
export const getAllPosts = () => async (dispatch) => {
    const response = await csrfFetch('/api/posts/');
    const data = await response.json();
    if (response.ok) {
        dispatch(setAllPosts(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};

// Get single post /api/posts/:id
export const getSinglePost = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/posts/${id}`);
    const data = await response.json();
    if (response.ok) {
        dispatch(setSinglePost(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};

// Get all posts by user /api/posts/user/:id
export const getAllPostsByUser = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/posts/user/${id}`);
    const data = await response.json();
    if (response.ok) {
        dispatch(setAllPostsByUser(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};

// Create post /api/posts/
export const createPost = (posts) => async (dispatch) => {
    const {title, body, userId, description} = posts;
    console.log(posts)
    const response = await csrfFetch('/api/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            body,
            userId,
            description
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setSinglePost(data));
        dispatch(setAllPostsByUser(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};

// Delete posts /api/posts/:id
export const deletePost = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/posts/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(removePost());
        dispatch(setAllPostsByUser(data));
        dispatch(setSinglePost(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};

// Edit posts /api/posts/:id
export const editPost = (posts) => async (dispatch) => {
    const {title, body, userId, description, id, updatedAt} = posts;
    const response = await csrfFetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            body,
            userId,
            description,
            updatedAt
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setSinglePost(data));
        dispatch(setAllPostsByUser(data));
        return data;
    }
    else {
        console.log('error', data)
    }
};






const initialState = { allPosts: {}, singlePost: {}, allPostsByUser: {} };

const postsReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_ALL_POSTS:
            return { ...state, allPosts: action.payload };
        case SET_SINGLE_POST:
            return { ...state, singlePost: action.payload };
        case SET_ALL_POSTS_BY_USER:
            return { ...state, allPostsByUser: action.payload };
        case REMOVE_POST:
            return { ...state, singlePost: {} };
        default:
            return state;
    }
};

export default postsReducer;