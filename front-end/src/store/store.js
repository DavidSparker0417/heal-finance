import { configureStore } from "@reduxjs/toolkit";
import healReducer from "./healSlice";

export default configureStore({
  reducer: {
    heal: healReducer,
  },
})