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
	const windowWidth = window.innerWidth;
	const [pagePos,setPagePos] = useState({
		'Home': 0,
		'Search': windowWidth*1,
		'NewPost': windowWidth*2,
		'Auth':windowWidth*3
	});

	useEffect(()=>{
		// a switch case for page transitions between tabs
		// runs every time the page changes	its value or user taps on any tab
		// this along with the css styling combined, creates smooth sliding effect when transitioning between the tabs 
		switch (page) {
			case 'Home':
				setPagePos({
					'Home': 0,
					'NewPost': windowWidth*1,
					'Search': windowWidth*2,
					'Profile':windowWidth*3
				});
				break;
			case 'NewPost':
				setPagePos({
					'Home': windowWidth*-1,
					'NewPost': 0,
					'Search': windowWidth*1,
					'Profile':windowWidth*2
				});
				break;
			case 'Search':
				setPagePos({
					'Home': windowWidth*-2,
					'NewPost': windowWidth*-1,
					'Search': 0,
					'Profile':windowWidth*1
				});
				break;
			case 'Profile':
				setPagePos({
					'Home': windowWidth*-3,
					'NewPost': windowWidth*-2,
					'Search': windowWidth*-1,
					'Profile':0
				});
				break;
			default:
				break;
		}
	},[page]);
	
	return(
		<>
			<main id="main-content">
				<Home position={pagePos}/>
				<Search position={pagePos}/>
				<NewPost position={pagePos}/>
				{user?<Profile position={pagePos}/>:<Login position={pagePos}/>}
				{
					isloading?<Loader/>:null
				}
			</main>
			<Footer/>
		</>
	);
}
export default Index;