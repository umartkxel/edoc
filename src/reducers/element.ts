import {
  ADD_ELEMENT,
  REMOVE_ELEMENT,
  EDIT_ELEMENT,
  SET_ELEMENT,
  USER_LOGOUT,
  RESET_STATE,
} from "../constants/actionTypes";
import {
  createNotification,
  IActionType as INotificationActions,
} from "../helpers/notificationHelper";
import { IElement } from "../interface";

export interface IStoreState {
  loader: boolean;
  error: boolean;
  message: string;
  element: IElement[][];
  total: number;
}
const INITIAL_STATE: IStoreState = {
  loader: false,
  error: false,
  message: "",
  element: [],
  total: 0,
};

interface IActionType {
  type: string;
  payload: any;
}
const reducer = (
  state = INITIAL_STATE,
  { type, payload }: IActionType = { type: "", payload: {} }
): IStoreState => {
  switch (type) {
    case USER_LOGOUT: {
      return { ...INITIAL_STATE };
    }

    case RESET_STATE: {
      return { ...INITIAL_STATE };
    }

    case SET_ELEMENT: {
      const { index, element = [], total } = payload;
      const value = [...state.element];
      value[index] = element;
      createNotification(
        INotificationActions.success,
        "Elements Saved",
        2000,
        "bottom-right"
      );
      return {
        ...state,
        element: value,
        total,
      };
    }
    case ADD_ELEMENT: {
      console.log(payload);
      const { value } = payload;
      return {
        ...state,
        element: [...state.element, value],
      };
    }

    case EDIT_ELEMENT: {
      const { index, value } = payload;
      const clone = [...state.element];
      clone[index] = value;
      return {
        ...state,
        element: clone,
      };
    }

    case REMOVE_ELEMENT: {
      const { index } = payload;
      const newElement = [...state.element];
      newElement.splice(index, 1);
      return {
        ...state,

        element: newElement,
      };
    }

    default:
      return state;
  }
};

export default reducer;
