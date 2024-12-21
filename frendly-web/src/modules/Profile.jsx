import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { login, logout, profilePosts } from "../global/UserSlice";
import { AppContext } from "../Context";

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
	const [settingsOpen, setSettingsOpen] = useState(false);

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
						<button onClick={()=>{setSettingsOpen(true)}}><img src="/assets/setting.png" className="tiny-icon" alt=""></img></button>
						</div>:null}
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
									<div className="post" key={index} onClick={()=>{setUserPosts(posts);navigate('/profile/'+profile?.username+'/posts')}}>
										<img src={rooturl+`${post.post_content[0]}`} alt="" />
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
				<div id="profile-settings-container" style={settingsOpen?{display:'block'}:{display:'none'}}></div>
				<div id="profile-settings" style={settingsOpen?{inset:'60px 1rem'}:{inset:'100vh 1rem 0 1rem'}}>
					<div id="settings-head">
						<h3>Settings</h3>
						<button onClick={()=>setSettingsOpen(false)}><img src="/assets/close.png" className="tiny-icon" alt=""></img></button>
					</div>
					<div id="settings-body" onClick={()=>setSettingsOpen(false)}>
						<button onClick={()=>{dispatch(logout())}}><img src="/assets/logout.png" alt="" className="tiny-icon"></img><span>Logout</span></button>
					</div>
				</div>
			</div>
		)
	}else {
		return(
			<Login/>
		)
	}

}