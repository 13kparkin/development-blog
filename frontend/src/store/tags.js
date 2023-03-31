import { csrfFetch } from './csrf';

const SET_ALL_TAGS = 'tags/setAllTags';
const SET_SINGLE_TAG = 'tags/setSingleTag';
const REMOVE_TAG = 'tags/removeTag';

const setAllTags = (tags) => ({
    type: SET_ALL_TAGS,
    payload: tags,
});

const setSingleTag = (tag) => ({
    type: SET_SINGLE_TAG,
    payload: tag,
});

const removeTag = (tag) => ({
    type: REMOVE_TAG,
    payload: tag,
});


// Get all tags
export const getAllTags = () => async (dispatch) => {
    const response = await csrfFetch('/api/tags/');
    const data = await response.json();
    if (response.ok) {
        dispatch(setAllTags(data));
        return data;
    }
    else {
        console.log('error', data)
    }
}

// Get single tag /api/tags/:id
export const getSingleTag = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/tags/${id}`);
    const data = await response.json();
    if (response.ok) {
        dispatch(setSingleTag(data));
        return data;
    }
    else {
        console.log('error', data)
    }
}

// Create a tag /api/tags/ ///// Implement this in the future
export const createTag = (tag) => async (dispatch) => {
    const response = await csrfFetch('/api/tags/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setSingleTag(data));
        return data;
    }
    else {
        console.log('error', data)
    }
}

// Update a tag /api/tags/:id
export const updateTag = (tag) => async (dispatch) => {
    const [tagId,  postId, draftId] = tag 
    const response = await csrfFetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            postId,
            draftId,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setSingleTag(data));
        return data;
    }
    else {
        console.log('error', data)
    }
}

// remove tag 
export const deleteTag = (tag) => async (dispatch) => {
    dispatch(removeTag(tag));
}


const initialState = { allTags: {}, singleTag: {} };

const tagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_TAGS:
            return {...state, allTags: action.payload}
        case SET_SINGLE_TAG:
            return {...state, singleTag: action.payload}
        case REMOVE_TAG:
            return {...state, singleTag: {}, allTags: {...state.allTags, [action.payload.id]:action.payload}}
        default:
            return state;
    }
}

export default tagsReducer;