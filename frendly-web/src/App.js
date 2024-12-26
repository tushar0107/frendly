import { ChangePassword, Header } from "./modules/Base";
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
import { Settings } from "./modules/Settings";
import { Loader } from "./components/Loader";
import { Chat } from "./modules/Chat";

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
	const context = {
		feedPosts,
		setFeedPosts,
		page,
		setPage,
		search,
		setSearch,
		searchResult,
		setSearchResult,
		contacts,
		setContacts,
		isloading,
		setIsloading,
		userPosts,
		setUserPosts
	};

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
		
	},[]);

	useEffect(()=>{
		if(preferences && user){
			setIsloading(true);
			//fetch recent posts for feeds
			axios.post(apiurl+'feed-posts',{'preferences':preferences,'user_id':user?.id}).then((res)=>{
				if(res.data.status){
					setFeedPosts(res.data.data);
				}else{
					setFeedPosts([]);
				}
				setIsloading(false);
			}).catch(e=>{
				console.log('Error fetching posts: ',e.message);
				setIsloading(false);
			});
		}

		const localcontacts = localStorage.getItem('contacts');
		// fetch contacts if not in the localstorage
		if(!localcontacts?.length){
			axios.post(apiurl+'get-contacts',{username:user?.username}).then((res)=>{
				if(res.data.status){
					localStorage.setItem('contacts',JSON.stringify(res.data.data));
					setContacts(res.data.data);
				}else{
					setContacts(res.data.message);
				}
			}).catch(e=>console.log('Error fetching posts: ',e.message));
		}else{
			setContacts(JSON.parse(localcontacts));
		}
		
	},[user,contacts?.length]);
	

	return (
		<>
			<AppContext.Provider value={context}>
				<Routes>
					<Route path="/" element={<Index/>} />
					<Route path="index" element={<Index/>}/>
					<Route path="profile/posts/:username" element={<Home/>} />
					<Route path="profile/:username" element={<Profile />} />
					<Route path="contact" element={<Contact contacts={contacts} />} />
					<Route path="chat/:username" element={<Chat/>} />
					<Route path="settings" element={<Settings/>}/>
					<Route path="changepassword" element={<ChangePassword/>}/>
				</Routes>
			</AppContext.Provider>
		</>
	);
}

export default App;

