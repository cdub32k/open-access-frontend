import { combineReducers } from "redux";

import userReducer from "./user";
import videoReducer from "./video";
import imageReducer from "./image";
import noteReducer from "./note";
import feedReducer from "./feed";

export default combineReducers({
  user: userReducer,
  video: videoReducer,
  image: imageReducer,
  note: noteReducer,
  feed: feedReducer,
});
