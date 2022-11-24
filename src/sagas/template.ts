import {
  all,
  call,
  select,
  fork,
  put,
  takeLatest,
  takeLeading,
} from "redux-saga/effects";

import {
  ADD_TEMPLATE,
  EDIT_TEMPLATE,
  REMOVE_TEMPLATE,
  GET_TEMPLATES,
  GET_SINGLE_TEMPLATES,
  GET_CATAGORIES,
} from "../constants/actionTypes";
import {
  addTemplateLocal,
  editTemplateLocal,
  setTemplates,
  setSingleTemplate,
  removeTemplateLocal,
  setTemplateLoader,
  setCatagories,
} from "../actions/template";
import { ApiService } from "../services/apiService";
import { ip, token, user } from "../constants/selectors";

interface IAction {
  type: string;
  payload?: any;
}

export interface ResponseGenerator {
  [key: string]: any;
}

function* getTemplatesSaga({ payload }: IAction) {
  try {
    const { type, filters = [] } = payload;
    yield put(setTemplateLoader({ loader: true }));
    const session: string = yield select(token);
    const host: string = yield select(ip);
    const userData: ResponseGenerator = yield select(user);
    const controlid = userData.controlid;
    const body = {
      session,
      controlid,
      categories: filters,
      type,
      action: "GETLIST",
      host,
    };
    const path = `/TEMPLATES/`;
    const res: ResponseGenerator = yield call(ApiService.post, path, body);
    if (res.result) {
      yield put(setTemplates({ templateType: type, templates: res.templates }));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* getSingleTemplateSaga({ payload }: IAction) {
  try {
    yield put(setTemplateLoader({ loader: true }));
    //* const session: string = yield select(token);
    // const host: string = yield select(ip);
    // const userData: ResponseGenerator = yield select(user);
    // const controlid = userData.controlid;
    const path = ``;
    const res: ResponseGenerator = yield call(ApiService.get, path);
    if (res.result) {
      yield put(setSingleTemplate(res));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* editTemplateSaga({ payload }: IAction) {
  try {
    yield put(setTemplateLoader({ loader: true }));
    //* const session: string = yield select(token);
    // const host: string = yield select(ip);
    // const userData: ResponseGenerator = yield select(user);
    // const controlid = userData.controlid;
    const path = ``;
    const body = { ...payload };
    const index = body.index;
    delete body.index;
    const res: ResponseGenerator = yield call(ApiService.patch, path, body);
    if (res.result) {
      yield put(editTemplateLocal({ index, value: res }));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* removeTemplateSaga({ payload }: IAction) {
  try {
    yield put(setTemplateLoader({ loader: true }));
    const index = payload.index;
    //* const session: string = yield select(token);
    // const host: string = yield select(ip);
    // const userData: ResponseGenerator = yield select(user);
    // const controlid = userData.controlid;
    const path = ``;
    const res: ResponseGenerator = yield call(ApiService.delete, path);
    if (res.result) {
      yield put(removeTemplateLocal({ index }));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* addTemplateSaga({ payload }: IAction) {
  try {
    yield put(setTemplateLoader({ loader: true }));
    //* const session: string = yield select(token);
    // const host: string = yield select(ip);
    // const userData: ResponseGenerator = yield select(user);
    // const controlid = userData.controlid;
    const path = ``;
    const res: ResponseGenerator = yield call(ApiService.post, path, payload);
    if (res.result) {
      yield put(addTemplateLocal(res));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* getCatagoriesSaga({ payload }: IAction) {
  try {
    yield put(setTemplateLoader({ loader: true }));
    const session: string = yield select(token);
    const host: string = yield select(ip);
    const userData: ResponseGenerator = yield select(user);
    const controlid = userData.controlid;
    const body = {
      session,
      controlid,
      action: "GETLIST",
      search: "",
      host,
    };
    const path = `/CATEGORIES/`;
    const res: ResponseGenerator = yield call(ApiService.post, path, body);
    if (res.result) {
      yield put(setCatagories(res.categories));
    } else {
      yield put(setTemplateLoader({ loader: false }));
    }
  } catch (error: any) {
    yield put(setTemplateLoader({ loader: false }));
    console.log("error on load user");
  }
}

function* watchOnGetTemplates() {
  yield takeLeading(GET_TEMPLATES, getTemplatesSaga);
}

function* watchOnGetSingleTemplate() {
  yield takeLeading(GET_SINGLE_TEMPLATES, getSingleTemplateSaga);
}

function* watchOnRemoveTemplate() {
  yield takeLeading(REMOVE_TEMPLATE, removeTemplateSaga);
}

function* watchOnEditTemplate() {
  yield takeLeading(EDIT_TEMPLATE, editTemplateSaga);
}

function* watchOnAddTemplate() {
  yield takeLatest(ADD_TEMPLATE, addTemplateSaga);
}

function* watchOnGetCatagories() {
  yield takeLeading(GET_CATAGORIES, getCatagoriesSaga);
}

export default function* rootSaga() {
  yield all([
    fork(watchOnGetTemplates),
    fork(watchOnGetSingleTemplate),
    fork(watchOnRemoveTemplate),
    fork(watchOnEditTemplate),
    fork(watchOnAddTemplate),
    fork(watchOnGetCatagories),
  ]);
}
