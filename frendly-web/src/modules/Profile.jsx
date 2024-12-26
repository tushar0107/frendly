import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { login, logout, profilePosts } from "../global/UserSlice";
import { AppContext } from "../Context";
import { ChangePassword, HeadBar } from "./Base";

export const Profile = ({position})=>{
	const {username} = useParams();
	const {setIsloading,setUserPosts} = useContext(AppContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	//fetch user data from redux store
	var myProfile = useSelector(state=>state.user.user);
	var myPosts = useSelector(state=>state.user.posts || []);
	const [profile,setProfile] = useState({...myProfile});
	const [posts,setPosts] = useState([...myPosts]);
	const [postsLoading,setPostsLoading] = useState(false);

	const fetchPosts = ()=>{
		setIsloading(true);
		axios.post(apiurl+'refresh-profile',{'username':myProfile.username,'user_id':myProfile.id}).then((res)=>{
			if(res.data.status){
				setPosts(res.data.posts);
				localStorage.setItem('userdata',JSON.stringify(res.data.data));
				localStorage.setItem('posts',JSON.stringify(res.data.posts));
				dispatch(profilePosts(res.data.posts));
				dispatch(login({'user':res.data.data,'token':res.data.token||''}));
			}else{
				alert(res.data.message);
			}
			setIsloading(false);
		}).catch((e)=>{
			console.log(e.message);
			setIsloading(false);
		});
	}

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

	if(profile){
		return(
			<>
				{username?<HeadBar title={username}/>:null}
				<div className="container" style={{zIndex:'40',inset:'0 0 0 0',left:position?position['Profile']:0}}>
					<div id="profile-container">
						<div id="profile-banner">
							<div id="profile-photo">
								<img src="/assets/user.png" alt="" />
							</div>
							<span className="profile-username">{profile?.username}</span>
							{/* post settings buttons will appear if there is no username in the search bar
							i.e. if viewing other users the settings buttons will hide */}
							{!username?
							<div className="profile-action-btns">

							<button onClick={()=>{fetchPosts()}}><img src="/assets/refresh.png" alt="" className="tiny-icon" ></img></button>
							<button onClick={()=>{}}><img src="/assets/edit-icon.png" className="tiny-icon" alt=""></img></button>
							<Link to={'/settings'}><img src="/assets/setting.png" className="tiny-icon" alt=""></img></Link>
							</div>:null}
						</div>
						{postsLoading?
						<div id="posts-loading">
							<div id="loader"></div>
						</div>
						:
						<div id="posts-segment">
						{ posts?.length ? 
							<div id="profile-posts" className="segment-block">
							{
								posts.map((post,index)=>{
									return(
										<Link to={'/profile/posts/'+profile?.username} className="post" key={index} onClick={()=>{setUserPosts(posts)}}>
											{post.post_content[0].split('.').pop()!=='mp4'?<img src={rooturl+`${post.post_content[0]}`} alt="" ></img>:
											<video src={rooturl+`${post.post_content[0]}`}></video>}
											{post.post_content.length>1?<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>:null}
											<span className="likes"><img src="/assets/tiny-heart.png" className="tiny-img" alt="" />{post.like_count}</span>
										</Link>
									)
								})
							}
							</div> :
							<div className="null-container">
								<img className="no-posts-image" src="/assets/no-posts.png" alt="" />
								<p>No posts</p>
							</div>
						}
						</div>
						}
					</div>
					
				</div>
			</>
		)
	}else {
		return(
			<Login/>
		)
	}

}