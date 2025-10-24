import {  fetchBaseQuery  } from "@reduxjs/toolkit/query/react";
import { clearUser } from "../../Redux/Slice/UserSlice/UserSlice";



const baseQuery = fetchBaseQuery({
    // baseUrl: 'https://ebooksserver.noorulameen.tech/api',
    // baseUrl: "http://localhost:4040/api",
    baseUrl: "https://e-book-backend-mb79.onrender.com/api",
    // baseUrl: `${import.meta.env.VITE_BACKENDURL}/api`,
    credentials: "include",
    prepareHeaders: (Headers) =>{
        const token = localStorage.getItem('userToken')
        if (token) {
            Headers.set("authorization", `Bearer ${token}`);
        }
        return Headers;
    },
});


  
export const baseQueryWithReauth = async (args, api, extraOptions) =>{
    let result = await baseQuery(args, api, extraOptions);

    // if(result.error && result?.error?.status === 401){
        if (result?.error?.status === 401 && args.url !== '/user/refresh-token') {
        console.log("refresh token for sending request")
        
        const refreshResult = await baseQuery("/user/refresh-token", api, extraOptions);
        if (refreshResult.data) {
            const newAccessToken = refreshResult.data.access_token
            localStorage.setItem('userToken',newAccessToken)
            result = await baseQuery(args, api, extraOptions);
        }else{
        localStorage.removeItem('userToken');
        api.dispatch(clearUser()); 
        return refreshResult
        }

    }
    return result
};
