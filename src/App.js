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

function App() {
	const user = useSelector((state) => state.user.user);
	const dispatch = useDispatch();
	const [page, setPage] = useState("Home");
	const [contacts, setContacts] = useState([]);
	const [posts,setPosts] = useState([]);
	const [searchResult,setSearchResult] = useState([]);
	const [search,setSearch] = useState('');


	useEffect(()=>{
		if(!user){
			var userdataLocal = localStorage.getItem('userdata');
			var posts = localStorage.getItem('posts');
			var userdata = JSON.parse(userdataLocal);
			if(userdata){
				dispatch(login(userdata));
			}
			if(posts){
				dispatch(profilePosts(JSON.parse(posts)));
			}
		}
		
	}, []);

	useEffect(()=>{
		if(user?.preferences){
			//fetch posts for feed based on the preferences
			axios.post(apiurl+'get-posts',{'search':user?.preferences}).then((res)=>{
				if(res.data.status){
					setPosts(res.data.data.posts);
				}else{
					setPosts(res.data.message);
				}
			}).catch(e=>console.log('Error fetching posts: ',e.message));
		}

		// fetch contacts if not in the localstorage
		if(!contacts?.length){
			axios.post(apiurl+'get-contacts',{username:user?.username}).then((res)=>{
				if(res.data.status){
					setContacts(res.data.data);
				}else{
					setContacts(res.data.message);
				}
			}).catch(e=>console.log('Error fetching posts: ',e.message));
		}
		
	},[user]);
	

	return (
		<>
			<Header />
			<AppContext.Provider value={{posts,page,setPage,search,setSearch,searchResult,setSearchResult,contacts,setContacts }}>
				<Routes>
					<Route path="/" element={<Index/>} />
					<Route path="/index" element={<Index/>} />
					<Route path="/profile/:username" element={<Profile />} />
					<Route path="/contact" element={<Contact contacts={contacts} />} />
				</Routes>
			</AppContext.Provider>
		</>
	);
}

export default App;

