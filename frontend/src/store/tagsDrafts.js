import { csrfFetch } from './csrf';

const ADD_TAG_TO_DRAFT = 'tags/addTagToDraft';
const REMOVE_TAG_FROM_DRAFT = 'tags/removeTagFromDraft';


const addTagToDraft = (tag) => ({
    type: ADD_TAG_TO_DRAFT,
    payload: tag,
});

const removeTagFromDraft = (tag) => ({
    type: REMOVE_TAG_FROM_DRAFT,
    payload: tag,
});

// Add a tag to a draft /api/drafts/:id/tags
export const addTagToDraftThunk = (draft, tags) => async (dispatch) => {
    const { draftId } = draft;
    tags.map(async (tag) => {
        const tagId = tag.id;
        const response = await csrfFetch(`/api/drafts/${draftId}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                draftId,
                tagId,
            }),
        });
        const data = await response.json();
    if (response.ok) {
        dispatch(addTagToDraft(data));
        return data;
    }
    else {
        console.log('error', data)
    }
    })
    
    
}

// Remove a tag from a draft /api/drafts/:id/tags
export const removeTagFromDraftThunk = (draftId, tagId) => async (dispatch) => {
    const response = await csrfFetch(`/api/drafts/${draftId}/tags`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            draftId,
            tagId,
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(removeTagFromDraft(data));
        return data;
    }
    else {
        console.log('error', data)
    }
}

const initialState = {};

const tagsDraftsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TAG_TO_DRAFT:
            return {...state, [action.payload.id]: action.payload}
        case REMOVE_TAG_FROM_DRAFT:
            const newState = {...state}
            delete newState[action.payload.id]
            return newState
        default:
            return state;
    }
}

export default tagsDraftsReducer;