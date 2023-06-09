import { csrfFetch } from "./csrf";

const SET_SEARCH_HISTORY = "searches/setSearchHistory";

const setSearchHistory = (searchHistory) => ({
    type: SET_SEARCH_HISTORY,
    payload: searchHistory,
});


export const getSearchHistory = () => async (dispatch) => {
    const response = await csrfFetch("/api/searches");
    const searchHistory = await response.json();
    dispatch(setSearchHistory(searchHistory));
}

// get search history for a specific user
export const getSearchHistoryByUser = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/searches/${userId}`);
    const searchHistory = await response.json();
    dispatch(setSearchHistory(searchHistory));
}

export const createSearch = (search) => async (dispatch) => {
    const { userId, searchHistory } = search;

    const response = await csrfFetch("/api/searches", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            userId,
            searchHistory
        }),
    });
    const newSearch = await response.json();
    dispatch(setSearchHistory(newSearch));
}

const initialState = { searchHistory: {} };

const searchesReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_SEARCH_HISTORY:
            return { ...state, searchHistory: action.payload };
        default:
            return state;
    }
}

export default searchesReducer;
