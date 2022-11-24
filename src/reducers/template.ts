import {
  ADD_TEMPLATE_LOCAL,
  EDIT_TEMPLATE_LOCAL,
  REMOVE_TEMPLATE_LOCAL,
  SET_TEMPLATES,
  SET_TEMPLATE_LOADER,
  SET_SINGLE_TEMPLATES,
  SET_CATAGORIES,
  USER_LOGOUT,
} from "../constants/actionTypes";
import { IApiCategorie, IApiTemplate } from "../interface";

export interface IIsLoaded {
  Signing: boolean;
  Reference: boolean;
  Requested: boolean;
  cantagories: boolean;
}

export interface IStoreState {
  loader: boolean;
  error: boolean;
  message: string;
  templates: IApiTemplate[];
  template: IApiTemplate | null;
  isLoaded: IIsLoaded;
  categories: IApiCategorie[];
}
const INITIAL_STATE: IStoreState = {
  loader: false,
  error: false,
  template: null,
  message: "string",
  templates: [],
  isLoaded: {
    Signing: false,
    Reference: false,
    Requested: false,
    cantagories: false,
  },
  categories: [],
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
    case SET_TEMPLATES: {
      const { templates, templateType } = payload;
      let newTemplates: keyof IIsLoaded = templateType;
      return {
        ...state,
        isLoaded: { ...state.isLoaded, [newTemplates]: true },
        templates: [...templates],
        loader: false,
      };
    }
    case ADD_TEMPLATE_LOCAL: {
      const { value } = payload;
      return {
        ...state,
        templates: [...state.templates, value],
      };
    }

    case EDIT_TEMPLATE_LOCAL: {
      const { index, value } = payload;
      const clone = [...state.templates];
      clone[index] = value;
      return {
        ...state,
        templates: clone,
      };
    }

    case REMOVE_TEMPLATE_LOCAL: {
      const { index } = payload;
      const newTemplates = [...state.templates];
      newTemplates.splice(index, 1);
      return {
        ...state,
        templates: newTemplates,
      };
    }

    case SET_TEMPLATE_LOADER: {
      const { loader = false, error = false, message = "" } = payload;
      return {
        ...state,
        loader,
        error,
        message,
      };
    }

    case SET_SINGLE_TEMPLATES: {
      return {
        ...state,
        template: payload,
      };
    }

    case SET_CATAGORIES: {
      return {
        ...state,
        categories: payload,
        isLoaded: {
          ...state.isLoaded,
          cantagories: true,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
