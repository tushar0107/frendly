import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { logout } from "../global/UserSlice";
import { AppContext } from "../Context";

export const Profile = ()=>{
	const {username} = useParams();
	const {setIsloading} = useContext(AppContext);
	const dispatch = useDispatch();
	//fetch user data from redux store
	var myProfile = useSelector(state=>state.user.user);
	var myPosts = useSelector(state=>state.user.posts);
	const [profile,setProfile] = useState({...myProfile});
	const [posts,setPosts] = useState([...myPosts]);
	const [postsLoading,setPostsLoading] = useState(false);

	//if other user's profile is to be opened set the user to the url parameter
	useEffect(()=>{
		if(username){
			setIsloading(true);
			setPostsLoading(true);
			axios.get(apiurl+'get-user/'+username).then((res)=>{
				if(res.data.status){
					setProfile(res.data.data);
					setPosts(res.data.posts);
				}else{
					//if failed to fetch any profile set it to null
					// so the default behaviour of showing my profile will be overridden
					setProfile(null);
					setPosts(null);
				}
				setIsloading(false);
				setPostsLoading(false);
			}).catch(e=>{
				console.log('Error fetching user details: ',e.message);
				setIsloading(false);
				setPostsLoading(false);
			});
		}

	},[username]);

	if(myProfile){
		return(
			<section>
				<div id="profile-container">
					<div id="profile-banner">
						<div id="profile-photo">
							<img src="/assets/user.png" alt="" />
						</div>
						<span className="profile-username">{profile?.username}</span>
						{!username?<button id="logout-btn" onClick={()=>{dispatch(logout())}}><img src="/assets/logout.png" alt="" className="tiny-icon" /></button>:null}
					</div>
					{postsLoading?
					<div id="posts-loading">
						
					</div>
					:
					<div id="posts-segment">
					{ posts?.length ? 
						<div id="profile-posts" className="segment-block">
						{
							posts.map((post,index)=>{
								return(
									<div className="post" key={index}>
										<img src={`${post.post_content[0]}`} alt="" />
										<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
										<span className="likes"><img src="/assets/tiny-heart.png" className="tiny-img" alt="" />{post.likes}</span>
									</div>
								)
							})
						}
						</div> :null
					}
					</div>
					}
				</div>
			</section>
		)
	}else {
		return(
			<Login/>
		)
	}

}