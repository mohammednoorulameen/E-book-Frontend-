// import { createSlice  } from "@reduxjs/toolkit";

// const authSlice =createSlice({
//     name:'auth',
//     initialState:{
//         token: null,
//         adminToken:null,
//         // isAdminAuthenticated:false,
//     },
//     reducers: {
//         setCredentials: (state, action)=> {
//             const { accessToken } = action.payload;
//             state.token = accessToken;
//         },
//         setAdminCredentails: (state, action)=> {
//             const { accessToken } = action.payload;
//             state.adminToken = accessToken;
//             // state.isAdminAuthenticated = true;
//         }
//     }
// })

// export const { setCredentials, setAdminCredentails } = authSlice.actions;
// export default authSlice.reducer;
// export const selectCurrentToken = (state) => state.auth.token;