import { Header } from "./modules/Base";
import "./App.css";
import Index from "./modules/Index";
import { Route, Routes } from "react-router-dom";
import { Contact } from "./modules/Contact";
import { AppContext } from "./Context";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, profilePosts } from "./global/UserSlice";
import { Profile } from "./modules/Profile";
import { apiurl } from "./components/assets";
import { Home } from "./modules/Home";

function App() {
	const {user,preferences} = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [page, setPage] = useState("Home");
	const [contacts, setContacts] = useState([]);
	const [feedPosts,setFeedPosts] = useState([]);
	const [searchResult,setSearchResult] = useState([]);
	const [search,setSearch] = useState({search:'',category:''});
	const [isloading,setIsloading] = useState(false);
	const [userPosts,setUserPosts] = useState([]);


	useEffect(()=>{
		if(!user){
			var userdataLocal = localStorage.getItem('userdata');
			var postsLocal = localStorage.getItem('posts');
			var token = localStorage.getItem('token');
			var userdata = JSON.parse(userdataLocal);
			if(userdata){
				dispatch(login({'user':userdata,'token':token}));
			}
			if(postsLocal){
				dispatch(profilePosts(JSON.parse(postsLocal)));
			}
		}
		
	});

	useEffect(()=>{
		if(preferences){
			setIsloading(true);
			//fetch posts for feed based on the preferences
			axios.post(apiurl+'search',{'search':preferences}).then((res)=>{
				if(res.data.status){
					setFeedPosts(res.data.data.posts);
				}else{
					setFeedPosts([]);
				}
				setIsloading(false);
			}).catch(e=>{
				console.log('Error fetching posts: ',e.message);
				setIsloading(false);
			});
		}

		// const localcontacts = localStorage.getItem('contacts');
		// // fetch contacts if not in the localstorage
		// if(!localcontacts?.length){
		// 	axios.post(apiurl+'get-contacts',{username:user?.username}).then((res)=>{
		// 		if(res.data.status){
		// 			localStorage.setItem('contacts',JSON.stringify(res.data.data));
		// 			setContacts(res.data.data);
		// 		}else{
		// 			setContacts(res.data.message);
		// 		}
		// 	}).catch(e=>console.log('Error fetching posts: ',e.message));
		// }
		
	},[user,contacts?.length]);
	

	return (
		<>
			<Header />
			<AppContext.Provider value={{feedPosts,setFeedPosts,page,setPage,search,setSearch,searchResult,setSearchResult,contacts,setContacts,isloading,setIsloading,userPosts,setUserPosts }}>
				<Routes>
					<Route path="/" element={<Index/>} />
					<Route path="index" element={<Index/>}/>
					<Route path="/profile/:username/posts" element={<Home/>} />
					<Route path="profile/:username" element={<Profile />} />
					<Route path="contact" element={<Contact contacts={contacts} />} />
				</Routes>
			</AppContext.Provider>
		</>
	);
}

export default App;

