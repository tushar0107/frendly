import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	user:null,
	posts:[],
	token:null
}
const userSlice = createSlice({
	name:'user',
	initialState,
	reducers:{
		login(state,action){
			console.log(action.payload);
			state.user = action.payload.user;
			state.token = action.payload.token;
		},
		profilePosts(state,action){
			state.posts = action.payload;
		},
		logout(state){
			state.user = null;
		}
	}
});

export const {login,profilePosts,logout} = userSlice.actions;
export const userReducer = userSlice.reducer;