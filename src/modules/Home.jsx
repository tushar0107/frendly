import { useNavigate } from "react-router-dom";
import { rooturl } from "../components/assets";
import { useContext } from "react";
import { AppContext } from "../Context";

export const Home = ()=>{
	const {feedPosts} = useContext(AppContext);
	const navigate = useNavigate();

	if(feedPosts?.length){
	return(
		<div id="post-container">
			{
				feedPosts.length && feedPosts.map((post,index)=>{
					return(
					<div className="post-block" key={index}>
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
								<span className="like-btn" onClick={()=>{}}>
									{post.isLiked?
									<img src="/assets/heart-pink.png" alt="" />
									: 
									<img src="/assets/heart.png" alt="" />
									}
								</span>
								<span>{post.likes}</span>
								<span className="comment-btn">
									<img src="/assets/comment.png" alt="" />
								</span>
								<span>{post.comments}</span>
							</div>
							<div className="save-btn">
								<img src="/assets/bookmark.png" alt="" />
							</div>
						</div>
						<div className="post-context">
							<span><strong onClick={()=>{navigate('/profile/'+post.username)}}>{post.username}</strong> {post.caption}</span>
							<div className="post-hashtags">{post.hashtags.join(' ')}</div>
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