import axios from "axios";
import { useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { useNavigate } from "react-router-dom";

export const Search = ({props})=>{
	const {search,setSearch,searchResult, setSearchResult} = props;
	const [category,setCategory] = useState('Posts');
	const navigate = useNavigate();
	
	const searchHandle = ()=>{
		const form = {
			search:search,
			category:category
		}
		axios.post(apiurl+'get-posts',form).then((res)=>{
			if(res.data.data){
				setSearchResult(res.data.data);
			}else{
				console.log(res.data.message);
			}
		}).catch(e=>{console.log('Error in search: ',e)});
	}

	return(
		<section id="search-page">
			<form>
				<input type="text" id="search-bar" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search.."></input>
				<button type="button"><img src="/assets/next.png" className="small-icon" onClick={()=>searchHandle()} alt="" /></button>
			</form>
			<div id="search-category">
				<label><input type="checkbox" name="category" value={'Posts'} checked={category==='Posts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Posts</span></label>
				<label><input type="checkbox" name="category" value={'Accounts'} checked={category==='Accounts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Accounts</span></label>
				<label><input type="checkbox" name="category" value={'Videos'} checked={category==='Videos'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Videos</span></label>
				<label><input type="checkbox" name="category" value={'Tags'} checked={category==='Tags'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Tags</span></label>
			</div>
			<div id="search-result">
				{category==='Posts'?

				searchResult?.posts && 
					<div id="searched-posts">
					{
						searchResult.posts.map((post,index)=>{
							return(
								<div className="post" key={index}>
									<img src={rooturl+post.post_content[0]} alt="" />
									<span className="num-posts"><img src="/assets/posts-many.png" className="tiny-img" alt="" /></span>
								</div>
							)
						})
					}
					</div>				
				:
				category==='Accounts'?
					searchResult?.accounts && 
					(<div id="search-accounts">
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
				
				:null
				}
			</div>
		</section>
	);
}