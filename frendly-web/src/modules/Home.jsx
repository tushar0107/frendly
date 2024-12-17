import { useNavigate, useParams } from "react-router-dom";
import { rooturl } from "../components/assets";
import React, { useContext, useMemo } from "react";
import { AppContext } from "../Context";

export const Home = ({position})=>{
	const {username} = useParams();
	const {feedPosts,userPosts} = useContext(AppContext);
	const navigate = useNavigate();

	const likePost = (post,index)=>{
		// console.log(post);
		if(post.isLiked){
			post.isLiked = false;
			post.likes--;
			document.getElementById('like-btn-'+index).innerHTML = '<img src="/assets/heart.png" alt="" />';
			document.getElementById('like-count-'+index).innerHTML = post.likes;
		}else{
			post.isLiked = true;
			post.likes++;
			document.getElementById('like-btn-'+index).innerHTML = '<img src="/assets/heart-pink.png" alt="" />';
			document.getElementById('like-count-'+index).innerHTML = post.likes;
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
			<div id="post-container" className="container" style={{zIndex:'10',inset:'0 0 0 0',left:position?position['Home']:0}}>
				{
					posts.length && posts.map((post,index)=>{
						return(
						<div className="post-block" onDoubleClick={()=>{likePost(post,index)}} key={index}>
							<div className="post-head">
								<span>
									<img src="/assets/user.png" alt=""></img>
									<span onClick={()=>{navigate('/profile/'+post.username)}}>{post.username}</span>
								</span>
								<img src="/assets/ellipsis.png" className="post-more-btn" alt=""></img>
							</div>
							<div className="post-content">
								{post.post_content.length && post.post_content.map((img,index)=>{
									return(
										<img src={`${rooturl}${img}`} key={index} alt=""></img>
									)
								})
								}
							</div>
							<div className="post-actions">
								<div className="post-action-like-comment">
									<a className="like-btn" id={'like-btn-'+index} onClick={()=>{likePost(post,index)}}>
										{post.isLiked?
										<img src="/assets/heart-pink.png" alt="" />
										: 
										<img src="/assets/heart.png" alt="" />
										}
									</a>
									<a id={'like-count-'+index}>{post.likes}</a>
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
								<span><strong onClick={()=>{navigate('/profile/'+post.username)}}>{post.username}</strong> {post.caption}</span>
								{post.hashtags?<div className="post-hashtags">{post.hashtags.join(' ')}</div>:null}
							</div>
						</div>)
					})
				}
			</div>
		);
	}else{
		return(
			<p style={{textAlign:'center'}}>No more Posts</p>
		)
	}
}