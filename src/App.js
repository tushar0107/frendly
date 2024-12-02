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
	const [page, setPage] = useState("Home");
	const [contacts, setContacts] = useState([]);
	const dispatch = useDispatch();
	const [posts,setPosts] = useState([]);
	
	useEffect(()=>{
		if(!user){
			var userdata = localStorage.getItem('userdata');
			var posts = localStorage.getItem('posts');
			if(userdata){
				dispatch(login(JSON.parse(userdata)));
			}
			if(posts){
				dispatch(profilePosts(JSON.parse(posts)));
			}
		}
		//fetch posts
		axios.get(apiurl+'get-posts').then((res)=>{
			if(res.data.status){
				setPosts(res.data.data);
			}else{
				setPosts(res.data.message);
			}
		}).catch(e=>console.log('Error fetching posts: ',e.message));
		
	}, []);

	return (
		<>
			<Header />
			<AppContext.Provider value={{ page, setPage }}>
				<Routes>
					<Route path="/" element={<Index posts={posts} />} />
					<Route path="/index" element={<Index posts={posts} />} />
					<Route path="/profile/:username" element={<Profile />} />
					<Route path="/contact" element={<Contact contacts={contacts} />} />
				</Routes>
			</AppContext.Provider>
		</>
	);
}

export default App;

