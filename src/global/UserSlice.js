import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	user:null,
	posts:[]
}
const userSlice = createSlice({
	name:'user',
	initialState,
	reducers:{
		login(state,action){
			state.user = action.payload;
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