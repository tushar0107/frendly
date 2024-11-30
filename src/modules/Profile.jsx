import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { profilePosts } from "../global/UserSlice";

export const Profile = ()=>{
	const {username} = useParams();
	//fetch user data from redux store
	var myProfile = useSelector(state=>state.user.user);
	var myPosts = useSelector(state=>state.user.posts);
	const [profile,setProfile] = useState({...myProfile});
	const [posts,setPosts] = useState(myPosts);
	const dispatch = useDispatch();

	//if other user's profile is to be opened set the user to the url parameter
	useEffect(()=>{
		if(username){
			axios.get('http://192.168.1.11:8000/api/v1/get-user/'+username).then((res)=>{
				if(res.data.status){
					setProfile(res.data.data);
					setPosts(res.data.posts);
				}
			}).catch(e=>console.log('Error fetching user details: ',e.message));
		}

		if(!username && myPosts.length===0){
			axios.get('http://192.168.1.11:8000/api/v1/get-user/'+profile.username).then((res)=>{
				if(res.data.status){
					setPosts(res.data.posts);
					dispatch(profilePosts(res.data.posts));
				}
			}).catch(e=>console.log('Error fetching user details: ',e.message));
		}
	});

	if(myProfile){
		return(
		<section>
		<div id="profile-container">
			<div id="profile-banner">
				<div id="profile-photo">
					<img src="/assets/user.png" alt="" />
				</div>
				<span>{profile?.username}</span>
			</div>
			<div id="profile-posts">
				{
					(posts.length && posts.map((post,index)=>{
						return(
							<div className="post" key={index}>
								<img src={'http://192.168.1.11:8000'+post.post_content[0]} alt="" />
								<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
								<span className="likes"><img src="/assets/tiny-heart.png" className="tiny-img" alt="" />{post.likes}</span>
							</div>
						)
					})) || (<p style={{textAlign:'center'}}>No posts</p>)
				}
			</div>
		</div>
		</section>)
	}else {
		return(
			<Login/>
		)
	}

}