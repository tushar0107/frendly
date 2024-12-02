import { useContext, useEffect, useState } from "react";
import { Footer } from "./Base";
import { AppContext } from "../Context";
import {Search} from "./Search";
import {Home} from "./Home";
import {Profile} from "./Profile";
import { Login } from "./Login";
import { useSelector } from "react-redux";


const Index = ({posts})=>{
	const {page,setPage} = useContext(AppContext);
	const user = useSelector(state=>state.user.user);
	const [searchResult,setSearchResult] = useState([]);
	const [search,setSearch] = useState('');

	useEffect(()=>{
		console.log('index: ',searchResult);
	},[searchResult]);
	
	return(
	<>
		{
			(page==='Home' && <Home posts={posts}/>)||
			(page==='Search' && <Search props={{search,setSearch,searchResult,setSearchResult}}  />)||
			(page==='Profile' && (user?<Profile/>:<Login/>))
		}

		<Footer/>
	</>
	);
}
export default Index;