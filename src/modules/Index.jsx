import { useContext, useState } from "react";
import { Footer } from "./Base";
import { AppContext } from "../Context";
import {Search} from "./Search";
import {Home} from "./Home";
import {Profile} from "./Profile";
import { Contact } from "./Contact";


const Index = ({posts})=>{
	const {page,setPage} = useContext(AppContext);

	const [search,setSearch] = useState('');
	
	return(
	<section id={window.innerWidth>950?"main-content":""}>
		{
			(page==='Home' && <Home posts={posts}/>)||
			(page==='Search' && <Search props={{search,setSearch}} />)||
			(page==='Profile' && <Profile/>)
		}

		{window.innerWidth>950?
			<Contact />:
		null}
		<Footer/>
	</section>
	);
}
export default Index;