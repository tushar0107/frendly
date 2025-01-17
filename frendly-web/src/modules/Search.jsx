import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../Context";

export const Search = ({position})=>{
	const {search,setSearch,searchResult, setSearchResult,setIsloading,setUserPosts} = useContext(AppContext);
	const [category,setCategory] = useState(search.category || 'Accounts');
	
	const searchHandle = ()=>{
		setIsloading(true);
		setSearch({'search':search.search,'category':category});
		const form = {
			search:[search.search],
			category:category
		}
		axios.post(apiurl+'search',form).then((res)=>{
			if(res.data.data){
				console.log(res.data.data);
				setSearchResult(res.data.data);
			}else{
				console.log(res.data.message);
			}
			setIsloading(false);
		}).catch(e=>{
			console.log('Error in search: ',e);
			setIsloading(false);
		});
	}

	useEffect(()=>{
		
	},[search.search]);

	return(
		<div id="search-page" className="container" style={{zIndex:'30',inset:'0 0 0 0',left:position['Search']}}>
			<form>
				<input type="text" id="search-bar" value={search.search} onChange={(e)=>setSearch({'search':e.target.value,'category':category})} placeholder="Search.."></input>
				<button type="button"><img src="/assets/next.png" className="x-small-icon" onClick={()=>searchHandle()} alt="" /></button>
			</form>
			<div id="search-category">
				<label htmlFor="Accounts"><input type="checkbox" name="category" value={'Accounts'} checked={category==='Accounts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Accounts" /><span>Accounts</span></label>
				<label htmlFor="Posts"><input type="checkbox" name="category" value={'Posts'} checked={category==='Posts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Posts" /><span>Posts</span></label>
				<label htmlFor="Videos"><input type="checkbox" name="category" value={'Videos'} checked={category==='Videos'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Videos" /><span>Videos</span></label>
				<label htmlFor="Tags"><input type="checkbox" name="category" value={'Tags'} checked={category==='Tags'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Tags" /><span>Tags</span></label>
			</div>
			<div id="search-result">
				{category==='Posts'?
					searchResult?.posts && 
						<div id="searched-posts">
						{
							searchResult.posts.map((post,index)=>{
								return(
									// this is from search results where only one post is shown in the feed hence I have used==> setUserPosts([post]);
									<Link to={'/profile/posts/'+search.search+''} className="post" key={index} onClick={()=>{setUserPosts(searchResult.posts)}}>
											{post.post_content[0].split('.').pop()!=='mp4'?<img src={rooturl+`${post.post_content[0]}`} alt="" ></img>:
											<video src={rooturl+`${post.post_content[0]}`}></video>}
											<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
									</Link>
								)
							})
						}
						</div>
				:category==='Accounts'?
					searchResult?.accounts && 
					(<div className="accounts">
						{searchResult.accounts.map((account,index)=>{
							return(
							<Link to={'/profile/'+account.username} className="profile" key={index}>
								<img src="/assets/user.png" className="medium-icon" alt="" />
								<div className="profile-details">
									<span>{account.first_name+ ' '+account.last_name}</span><br />
									<span className="username">{account.username}</span>
								</div>
							</Link>)
						})}
					</div>)

				:category==='Tags'?
					searchResult?.tags && 
					<div id="searched-posts">
					{
						searchResult.tags.map((post,index)=>{
							return(
								<Link className="post" key={index}>
									<img src={post.post_content[0]} alt="" />
									<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
								</Link>
							)
						})
					}
					</div>	
				:null
				}
			</div>
		</div>
	);
}