import { csrfFetch } from "./csrf";

const SET_SINGLE_IMAGE = "images/setSingleImage";

const setSingleImage = (image) => ({
    type: SET_SINGLE_IMAGE,
    payload: image,
});

// create single image /api/images/:id
export const createSingleImage = (id, image) => async (dispatch) => {
    const { url, postId, draftId } = image;
    const response = await csrfFetch(`/api/drafts/${id}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url,
            postId,
            draftId,        
        }),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(setSingleImage(data));
        return data;
    } else {
        console.log("error", data);
    }
}

const initialState = {image: {}};

const imagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SINGLE_IMAGE:
            return { ...state, image: action.payload };
        default:
            return state;
    }
}


export default imagesReducer;
