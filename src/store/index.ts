import userReducer from "./reducers/userReducer";
import tokenReducer from "./reducers/tokenReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, combineReducers, createStore } from "redux";

export const rootReducer = combineReducers({ user: userReducer, token: tokenReducer });

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));
export default store;
