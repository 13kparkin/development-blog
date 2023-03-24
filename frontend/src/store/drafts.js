import { csrfFetch } from "./csrf";

const SET_SINGLE_DRAFT = "drafts/setSingleDraft";
const SET_ALL_DRAFTS = "drafts/setAllDrafts";
const REMOVE_DRAFT = "drafts/removeDraft";
const SET_ALL_DRAFTS_BY_USER = "drafts/setAllDraftsByUser";

const setAllDrafts = (drafts) => ({
  type: SET_ALL_DRAFTS,
  payload: drafts,
});
const setSingleDraft = (draft) => ({
  type: SET_SINGLE_DRAFT,
  payload: draft,
});
const removeDraft = () => ({
  type: REMOVE_DRAFT,
});
const setAllDraftsByUser = (drafts) => ({
  type: SET_ALL_DRAFTS_BY_USER,
  payload: drafts,
});

// Get all drafts
export const getAllDrafts = () => async (dispatch) => {
  const response = await csrfFetch("/api/drafts/");
  const data = await response.json();
  if (response.ok) {
    dispatch(setAllDrafts(data));
    return data;
  } else {
    console.log("error", data);
  }
};

// Get single draft /api/drafts/:id
export const getSingleDraft = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/drafts/${id}`);
  const data = await response.json();
  if (response.ok) {
    dispatch(setSingleDraft(data));
    return data;
  } else {
    console.log("error", data);
  }
};

// Get all drafts by user /api/drafts/user/:id
export const getAllDraftsByUser = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/drafts/user/${id}`);
  const data = await response.json();
  if (response.ok) {
    dispatch(setAllDraftsByUser(data));
    return data;
  } else {
    console.log("error", data);
  }
};

// Create draft /api/drafts/
export const createDraft = (drafts) => async (dispatch) => {
  const { title, body, userId, description } = drafts;
  const response = await csrfFetch("/api/drafts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      userId,
      description,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(setSingleDraft(data));
    dispatch(setAllDraftsByUser(data));
    return data;
  } else {
    console.log("error", data);
  }
};

// Delete drafts /api/drafts/:id
export const deleteDraft = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/drafts/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(removeDraft());
    dispatch(setAllDraftsByUser(data));
    return data;
  } else {
    console.log("error", data);
  }
};

// Edit drafts /api/drafts/:id
export const editDraft = (drafts) => async (dispatch) => {
  const { title, body, userId, description, id, updatedAt } = drafts;
  const response = await csrfFetch(`/api/drafts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      body,
      userId,
      description,
      updatedAt,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(setSingleDraft(data));
    dispatch(setAllDraftsByUser(data));
    return data;
  } else {
    console.log("error", data);
  }
};

const initialState = { allDrafts: {}, singleDrafts: {}, allDraftsByUser: {} };

const draftsReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_DRAFTS:
      return { ...state, allDrafts: action.payload };
    case SET_SINGLE_DRAFT:
      return { ...state, singleDraft: action.payload };
    case SET_ALL_DRAFTS_BY_USER:
      return { ...state, allDraftsByUser: action.payload };
    case REMOVE_DRAFT:
      return { ...state, singleDraft: {} };
    default:
      return state;
  }
};

export default draftsReducer;
