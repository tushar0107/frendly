import { useContext, useEffect, useState } from "react";
import { Footer } from "./Base";
import { AppContext } from "../Context";
import {Search} from "./Search";
import {Home} from "./Home";
import {Profile} from "./Profile";
import { Login } from "./Login";
import { useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { NewPost } from "./NewPost";


const Index = ()=>{
	const {page,isloading} = useContext(AppContext);
	const user = useSelector(state=>state.user.user);

	
	return(
	<>
		{
			(page==='Home' && <Home/>)||
			(page==='Search' && <Search/>)||
			(page==='NewPost' && <NewPost/>)||
			(page==='Profile' && (user?<Profile/>:<Login/>))
		}
		{isloading?<Loader/>:null}
		<Footer/>
	</>
	);
}
export default Index;