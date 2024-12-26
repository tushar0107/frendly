import { Link, useNavigate, useParams } from "react-router-dom";
import { apiurl, rooturl } from "../components/assets";
import React, { useContext, useMemo } from "react";
import { AppContext } from "../Context";
import axios from "axios";
import { useSelector } from "react-redux";
import { HeadBar } from "./Base";

export const Home = ({position})=>{
	const {username} = useParams();
	const {user} = useSelector(state=>state.user);
	const {feedPosts,setFeedPosts,userPosts} = useContext(AppContext);

	const likePost = (post,index)=>{
		if(post.liked_acc_id !== null){
			post.liked_acc_id = null;
			post.like_count--;
			document.getElementById('like-btn-'+index).innerHTML = '<img src="/assets/heart.png" alt="" />';
			document.getElementById('like-count-'+index).innerHTML = Math.max(post.like_count,0);
			axios.post(apiurl+'like-post',{'post_id':post.id,'user_id':post.author_id,'like':false}).then((res)=>{
				var tempposts = [...feedPosts];
				tempposts[index].liked_acc_id=null;
				setFeedPosts(tempposts);
			});
		}else{
			post.liked_acc_id = user.id;
			post.like_count++;
			document.getElementById('like-btn-'+index).innerHTML = '<img src="/assets/heart-pink.png" alt="" />';
			document.getElementById('like-count-'+index).innerHTML = post.like_count;
			axios.post(apiurl+'like-post',{'post_id':post.id,'user_id':post.author_id,'like':true}).then((res)=>{
				var tempposts = [...feedPosts];
				tempposts[index].liked_acc_id=user.id;
				setFeedPosts(tempposts);
			});
		}
	}

	const posts = useMemo(()=>{
		if(userPosts && username){
			return userPosts;
		}else{
			return feedPosts;
		}
	},[userPosts,feedPosts]);


	if(posts?.length){
		return(
			<>
			{username?<HeadBar title={username}/>:null}
			<div id="post-container" className="container" style={{zIndex:'10',inset:'0 0 0 0',left:position?position['Home']:0}}>
				{
					posts.length && posts.map((post,index)=>{
						return(
						<div className="post-block" onDoubleClick={()=>{likePost(post,index)}} key={index}>
							<div className="post-head">
								<Link to={'/profile/'+post.username}>
									<img src="/assets/user.png" alt=""></img>
									<div>
										<span>{post.username}</span>
										<span className='misc'>{post.location || new Date(post.updated_at).toDateString()}</span>
									</div>
								</Link>
								<img src="/assets/ellipsis.png" className="post-more-btn" alt=""></img>
							</div>
							<div className="post-content">
								{post.post_content.length && post.post_content.map((img,index)=>{
									if(img.split('.').pop()!=='mp4'){
										return(
											<img src={`${rooturl}${img}`} key={index} alt=""></img>
										)
									}else{
										return(
											<video src={`${rooturl}${img}`} key={index} controls></video>
										)
									}
								})
								}
							</div>
							<div className="post-actions">
								<div className="post-action-like-comment">
									<a className="like-btn" id={'like-btn-'+index} onClick={()=>{likePost(post,index)}}>
										{post.liked_acc_id===user?.id?
										<img src="/assets/heart-pink.png" alt="" />
										: 
										<img src="/assets/heart.png" alt="" />
										}
									</a>
									<a id={'like-count-'+index}>{post.like_count}</a>
									<a className="comment-btn">
										<img src="/assets/comment.png" alt="" />
									</a>
									<a>{post.comments}</a>
								</div>
								<div className="save-btn">
									<img src="/assets/bookmark.png" alt="" />
								</div>
							</div>
							<div className="post-context">
								{post.caption?<Link to={'/profile/'+post.username}><strong>{post.username}</strong> {post.caption}</Link>:''}
								{post.hashtags?<div className="post-hashtags">{post.hashtags.join(' ')}</div>:null}
							</div>
						</div>)
					})
				}
			</div>
			</>
		);
	}else{
		return(
			<p style={{textAlign:'center'}}>No more Posts</p>
		)
	}
}