import { useContext, useEffect, useState } from "react";
import { Footer } from "./Base";
import { AppContext } from "../Context";
import {Search} from "./Search";
import {Home} from "./Home";
import {Profile} from "./Profile";
import { Login } from "./Login";
import { useSelector } from "react-redux";
import { apiurl, getItem, setItem } from "../components/assets";
import axios from 'axios';


const Index = ()=>{
	const {page,contacts, setContacts,feedPosts,setFeedPosts,searchResult,setSearchResult,search,setSearch} = useContext(AppContext);
	const {user,preferences} = useSelector(state=>state.user);
	

	useEffect(()=>{
		if(!user){
			// var userdataLocal = localStorage.getItem('userdata');
			// var postsLocal = localStorage.getItem('posts');
			// var token = localStorage.getItem('token');
			// var userdata = JSON.parse(userdataLocal);
			// if(userdata){
			// 	dispatch(login({'user':userdata,'token':token}));
			// }
			// if(postsLocal){
			// 	dispatch(profilePosts(JSON.parse(postsLocal)));
			// }
		}
		
	});

	useEffect(()=>{
		if(preferences.length){
			//fetch posts for feed based on the preferences
			axios.post(apiurl+'get-posts',{'search':preferences}).then((res)=>{
				if(res.data.status){
					setFeedPosts(res.data.data.posts);
				}else{
					setFeedPosts([]);
				}
			}).catch(e=>console.log('Error fetching posts: ',e.message));
		}
		
	},[user,contacts?.length]);

	return(
	<>
		{
			(page==='Home' && <Home/>)||
			(page==='Search' && <Search/>)||
			(page==='Profile' && (user?<Profile/>:<Login/>))
		}

		<Footer/>
	</>
	);
}
export default Index;