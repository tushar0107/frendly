import { useContext, useEffect, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import {AppContext} from '../Context';
import { useSelector } from "react-redux";
const {name} = require('../../package.json');
const appName = name;

const Header = ()=>{
	const user = useSelector(state=>state.user.user);

	return(
		<header>
			<div id="logo">
				<span>{appName}</span>
			</div>
			{user?<Link to={'/contact'}>
				<img src="/assets/live-chat.png" alt="" />
			</Link>:null}
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
			<div onClick={()=>{changePage('NewPost')}} className={page==='NewPost'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/add-post.png" alt=""></img></div>
			<div onClick={()=>{changePage('Search')}} className={page==='Search'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/search.png" alt=""></img></div>
			<div onClick={()=>{changePage('Profile')}} className={page==='Profile'?'tab-active tab':'tab'}><img className="footer-icon" src="/assets/user.png" alt=""></img></div>
		</footer>
	);
}

export {Footer, Header};