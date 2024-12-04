import { useContext, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AppContext} from '../Context';
import { useSelector } from "react-redux";
const {name} = require('../../package.json');
const appName = name;

export const Base = ()=>{

	return(
		<>

		</>
	);
}


const NavLinks = ()=>{
	return(
		<>
		<Link to={'/'} style={{borderBottom:window.location.pathname==='/'?'2px solid black':'none'}} onClick={()=>{}}>Home</Link>
		<Link to={'/aboutus'} style={{borderBottom:window.location.pathname==='/aboutus'?'2px solid black':'none'}} onClick={()=>{}}>About</Link>
		<Link style={{borderBottom:window.location.pathname==='/services'?'2px solid black':'none'}} onClick={()=>{}}>Services</Link>
		<Link style={{borderBottom:window.location.pathname==='/contact'?'2px solid black':'none'}} onClick={()=>{}}>Contact</Link>
		</>
	);
}

const AuthLinks = ()=>{
	const navigate = useNavigate();
	return(
		<>	
			<div id="auth-actions">
				<div onClick={()=>{navigate('/login');}}>Log In</div>
				<div onClick={()=>{navigate('/signup');}} className="sign-up-btn">Sign Up</div>
			</div>
		</>
	);
}

const Header = ()=>{
	const user = useSelector(state=>state.user.user);

	return(
		<header>
			<div id="logo">
				{/* <img src="/images/logo.png" alt="" /> */}
				<span>{appName}</span>
			</div>
			{user?<Link to={'/contact'}>
				<img src="/assets/live-chat.png" alt="" />
			</Link>:null}
			{/* <div id="menu-btn" onClick={()=>{}}>
				<div className="btn-line" style={{width:'80%'}}></div>
				<div className="btn-line" style={{width:'60%'}}></div>
				<div className="btn-line" style={{width:'40%'}}></div>
			</div> */}
		</header>
	);
}

const Footer = ()=>{
	const [isPending,setTransition] = useTransition();
	const {page,setPage} = useContext(AppContext);
	const changePage = (page)=>{setTransition(()=>{
		setPage(page);
	})};
	return(
		<footer>
			<div onClick={()=>{changePage('Home')}} className={page==='Home'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/house.png" alt=""></img></div>
			<div onClick={()=>{changePage('Search')}} className={page==='Search'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/add-post.png" alt=""></img></div>
			<div onClick={()=>{changePage('Search')}} className={page==='Search'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/search.png" alt=""></img></div>
			<div onClick={()=>{changePage('Profile')}} className={page==='Profile'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/user.png" alt=""></img></div>
		</footer>
	);
}

export {Footer, Header};