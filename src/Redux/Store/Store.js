import { configureStore } from "@reduxjs/toolkit";
import  { adminApi }  from "../../Services/Apis/AdminApi.js"
import  { userApi } from "../../Services/Apis/UserApi.js"
// import  authReducer  from "../Slice/AuthSlice.js";
import userReducer  from "../Slice/UserSlice/UserSlice.js";


export const store = configureStore({
  reducer:{
    // auth:authReducer,
    user:userReducer,
    [userApi.reducerPath] : userApi.reducer,
    [adminApi.reducerPath] : adminApi.reducer,
  },

  middleware: ( getDefaultMiddleware )=>
    getDefaultMiddleware().concat(userApi.middleware)
  .concat(adminApi.middleware)
})