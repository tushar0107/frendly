import { useContext, useEffect, useState } from "react";
import { Footer } from "./Base";
import { AppContext } from "../Context";
import {Search} from "./Search";
import {Home} from "./Home";
import {Profile} from "./Profile";
import { Login } from "./Login";
import { useSelector } from "react-redux";


const Index = ()=>{
	const {page} = useContext(AppContext);
	const user = useSelector(state=>state.user.user);
	
	return(
	<>
		{
			(page==='Home' && <Home/>)||
			(page==='Search' && <Search/>)||
			(page==='Profile' && (user?<Profile/>:<Login/>))
		}

		<Footer/>
	</>
	);
}
export default Index;