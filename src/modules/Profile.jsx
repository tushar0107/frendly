import { useSelector } from "react-redux";
import { Login } from "./Login";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";

export const Profile = ()=>{
	const {username} = useParams();
	//fetch user data from redux store
	var myProfile = useSelector(state=>state.user.user);
	var myPosts = useSelector(state=>state.user.posts);
	const [profile,setProfile] = useState({...myProfile});
	const [posts,setPosts] = useState([...myPosts]);
	const [postsLoading,setPostsLoading] = useState(false);

	//if other user's profile is to be opened set the user to the url parameter
	useEffect(()=>{
		if(username){
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
				setPostsLoading(false);
			}).catch(e=>console.log('Error fetching user details: ',e.message));
		}

	},[]);

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
					{postsLoading?
					<div id="posts-loading">

					</div>
					:
					<div id="posts-segment">
					{ posts?.length && 
						<div id="profile-posts" className="segment-block">
						{
							posts.map((post,index)=>{
								return(
									<div className="post" key={index}>
										<img src={rooturl+post.post_content[0]} alt="" />
										<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
										<span className="likes"><img src="/assets/tiny-heart.png" className="tiny-img" alt="" />{post.likes}</span>
									</div>
								)
							})
						}
						</div>
						|| (<p>Nothing to show</p>)
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