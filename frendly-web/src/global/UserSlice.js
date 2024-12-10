import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	user:null,
	posts:[],
	token:null,
	preferences:null,
}
const userSlice = createSlice({
	name:'user',
	initialState,
	reducers:{
		login(state,action){
			var payload = action.payload;
			state.user = payload.user;
			state.token = payload.token;
			if(payload.preferences){
				state.preferences = payload.preferences;
			}else{
				state.preferences = ['nature','photography'];
			}
		},
		profilePosts(state,action){
			state.posts = action.payload;
		},
		logout(state){
			state.user = null;
			localStorage.removeItem('userdata');
			localStorage.removeItem('posts');
			localStorage.removeItem('token');
			localStorage.removeItem('preferences');
		}
	}
});

export const {login,profilePosts,logout} = userSlice.actions;
export const userReducer = userSlice.reducer;