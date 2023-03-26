import { csrfFetch } from "./csrf";

const SET_GPT = "gpt/getGpt";
const SET_ERRORS = "gpt/setErrors";

const setGpt = (gpt) => ({
  type: SET_GPT,
  payload: gpt,
});

const setErrors = (errors) => ({
    type: SET_ERRORS,
    payload: errors,
    });


export const getGptMessages = (data, question) => async (dispatch) => {
  const response = await csrfFetch("/api/digitalBrain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
      question,
    }),
  });
  const data1 = await response.json();
  console.log(data1)
  if (response.ok) {
    dispatch(setGpt(data1));
    return data1;
  } else {
    console.log("error", data1);
    return new Error("There was  a problem with the network", data1);
  }
};

const initialState = { getGptMessages: {} };

const gptReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GPT:
      return { ...state, getGptMessages: action.payload };
    case SET_ERRORS:
        return { ...state, errors: action.payload };
    default:
      return state;
  }
};

export default gptReducer;
