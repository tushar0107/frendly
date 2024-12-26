import { useContext, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import {AppContext} from '../Context';
import { useSelector } from "react-redux";
import axios from "axios";
import { apiurl } from "../components/assets";
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

const HeadBar = ({title,detail})=>{
	return(
	<header id="headbar">
		<div id="head">
			<button onClick={()=>window.history.back()}><img src="/assets/back.png" className="tiny-icon" alt="" ></img></button>
			<p>
				<span>{title}</span>
				{detail?<span className="name">{detail?.first_name+' '+detail.last_name}</span>:null}
			</p>
		</div>
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

const ChangePassword = ()=>{
	const [pass,setPass] = useState('');
	const [confPass,setConfPass] = useState('');
	const [passShow,setPassShow] = useState(false);
	const [confPassShow,setConfPassShow] = useState(false);
	const {setIsloading} = useContext(AppContext);
	const user = useSelector(state=>state.user.user);

	const passChange = (action)=>{
		if(pass && confPass){
			setIsloading(true);
			axios.post(apiurl+action,{'username':user.username,'oldPass':pass,'newPass':confPass}).then((res)=>{
				if(res.data.status){
					setIsloading(false);
					alert(res.data.status);
				}
			}).catch(e=>{
				setIsloading(false);
				console.log()
			});
		}
	}

	return (
		<div id="login-modal" className="">
			<form id="change-password" className="auth-container">
				<h2>Change Password</h2>
				<label htmlFor="old-password">
					<input type={passShow?"text":"password"} value={pass} onChange={(e)=>setPass(e.target.value)}></input>
					<span style={pass?{top:'0px',left: '.3rem',fontSize: '0.8rem'}:null}>Enter Current Password</span>
					<img src={`/assets/${passShow?'hide.png':'show.png'}`} onClick={()=>setPassShow(!passShow)} className="pass-show-hide" alt="" />
					</label>
				<label htmlFor="new-password">
					<input type={confPassShow?"text":"password"} value={confPass} onChange={(e)=>setConfPass(e.target.value)}></input>
					<span style={confPass?{top:'0px',left: '.3rem',fontSize: '0.8rem'}:null}>Enter New Password</span>
					<img src={`/assets/${confPassShow?'hide.png':'show.png'}`} onClick={()=>setConfPassShow(!confPassShow)} className="pass-show-hide" alt="" />
				</label>
				<div className="submit">
					<button type="button" className="submit-btn btn" onClick={()=>{passChange('change-password')}}>Submit</button>|
					<button onClick={()=>{window.history.back()}} type="button" className="submit-btn btn">Cancel</button>
				</div>
			</form>
		</div>
	);
}

export {Footer, Header, HeadBar, ChangePassword};