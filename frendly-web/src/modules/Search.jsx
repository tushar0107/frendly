import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context";

export const Search = ()=>{
	const {search,setSearch,searchResult, setSearchResult,setIsloading} = useContext(AppContext);
	const [category,setCategory] = useState(search.category || 'Posts');
	const navigate = useNavigate();
	
	const searchHandle = ()=>{
		setIsloading(true);
		setSearch({'search':search.search,'category':category});
		const form = {
			search:[search.search],
			category:category
		}
		axios.post(apiurl+'search',form).then((res)=>{
			if(res.data.data){
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
		<section id="search-page">
			<form>
				<input type="text" id="search-bar" value={search.search} onChange={(e)=>setSearch({'search':e.target.value,'category':category})} placeholder="Search.."></input>
				<button type="button"><img src="/assets/next.png" className="x-small-icon" onClick={()=>searchHandle()} alt="" /></button>
			</form>
			<div id="search-category">
				<label htmlFor="Posts"><input type="checkbox" name="category" value={'Posts'} checked={category==='Posts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Posts" /><span>Posts</span></label>
				<label htmlFor="Accounts"><input type="checkbox" name="category" value={'Accounts'} checked={category==='Accounts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="Accounts" /><span>Accounts</span></label>
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
									<div className="post" key={index}>
										<img src={post.post_content[0]} alt="" />
										<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
									</div>
								)
							})
						}
						</div>				
				:category==='Accounts'?
					searchResult?.accounts && 
					(<div className="accounts">
						{searchResult.accounts.map((account,index)=>{
							return(
							<div className="profile" onClick={()=>navigate('/profile/'+account.username)} key={index}>
								<img src="/assets/user.png" className="medium-icon" alt="" />
								<div className="profile-details">
									<span>{'Actual Name'}</span><br />
									<span className="username">{account.username}</span>
								</div>
							</div>)
						})}
					</div>)

				:category==='Tags'?
					searchResult?.tags && 
					<div id="searched-posts">
					{
						searchResult.tags.map((post,index)=>{
							return(
								<div className="post" key={index}>
									<img src={post.post_content[0]} alt="" />
									<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
								</div>
							)
						})
					}
					</div>	
				:null
				}
			</div>
		</section>
	);
}