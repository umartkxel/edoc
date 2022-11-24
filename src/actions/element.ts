import {
  ADD_ELEMENT,
  EDIT_ELEMENT,
  REMOVE_ELEMENT,
  GET_ELEMENTS,
  SET_ELEMENT,
} from "../constants/actionTypes";

export const addElement = (payload?: any) => {
  return {
    type: ADD_ELEMENT,
    payload,
  };
};

export const editElement = (payload?: any) => {
  return {
    type: EDIT_ELEMENT,
    payload,
  };
};

export const removeElement = (payload?: any) => {
  return {
    type: REMOVE_ELEMENT,
    payload,
  };
};

export const getElements = (payload?: any) => {
  return {
    type: GET_ELEMENTS,
    payload,
  };
};

export const setElements = (payload?: any) => {
  return {
    type: SET_ELEMENT,
    payload,
  };
};
