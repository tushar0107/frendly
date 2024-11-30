import { useState } from "react";

export const Search = ({props})=>{
	const {search,setSearch} = props;
	const [category,setCategory] = useState('');
	return(
		<section id="search-page">
			<form>
				<input type="text" id="search-bar" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search.."></input>
				<button type="button"><img src="/assets/next.png" className="small-icon" alt="" /></button>
			</form>
			<div id="search-category">
				<label><input type="checkbox" name="category" value={'Posts'} checked={category==='Posts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Posts</span></label>
				<label><input type="checkbox" name="category" value={'Accounts'} checked={category==='Accounts'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Accounts</span></label>
				<label><input type="checkbox" name="category" value={'Videos'} checked={category==='Videos'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Videos</span></label>
				<label><input type="checkbox" name="category" value={'Tags'} checked={category==='Tags'?true:false} onChange={(e)=>(setCategory(e.target.value))} id="" /><span>Tags</span></label>
			</div>
			<div id="search-result">
				
			</div>
		</section>
	);
}