import {
  ADD_FILE,
  EDIT_FILE,
  REMOVE_FILE,
  SET_FILES,
} from "../constants/actionTypes";

export const addFile = (payload?: any) => {
  return {
    type: ADD_FILE,
    payload,
  };
};

export const editFile = (payload?: any) => {
  return {
    type: EDIT_FILE,
    payload,
  };
};

export const removeFile = (payload?: any) => {
  return {
    type: REMOVE_FILE,
    payload,
  };
};

export const setFiles = (payload?: any) => {
  return {
    type: SET_FILES,
    payload,
  };
};
