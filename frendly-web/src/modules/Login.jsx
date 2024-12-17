import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login, profilePosts } from "../global/UserSlice";
import axios from "axios";
import { apiurl } from "../components/assets";
import { AppContext } from "../Context";


export const Login = ({position})=>{
	const {setIsloading} = useContext(AppContext);
	const [username,setUserName] = useState('');
	const [password,setPassword] = useState('');
	const [passShow,setPassShow] = useState(false);
	const input = useRef();
	const dispatch = useDispatch();

	const loginHandle = (action)=>{
		setIsloading(true);
		const data = {username:username,password:password};
		axios.post(apiurl+action,data).then((res)=>{
			if(res.data.status){
				localStorage.setItem('userdata',JSON.stringify(res.data.data));
				localStorage.setItem('posts',JSON.stringify(res.data.posts));
				localStorage.setItem('token',JSON.stringify(res.data.token));
				dispatch(login({'user':res.data.data,'token':res.data.token}));
				dispatch(profilePosts(res.data.posts));
			}
			setIsloading(false);
		}).catch(e=>{
			console.log('login error: ',e.message);
			dispatch(login(data));
			setIsloading(false);
		});
	}
	
	useEffect(()=>{
		setIsloading(false);
		input.current.focus();
	},[]);

	return(
		<div id="login-modal" className="container" style={{zIndex:'40',inset:'0 0 0 0',left:position?position['Profile']:0}}>
		<form action="" id="login-container">
			<h2>Login</h2>
			<label htmlFor="username">
				<input type="text" value={username} onChange={(e)=>setUserName(e.target.value)} ref={input}></input>
				<span style={username?{top:'0px',left: '.3rem',fontSize: '0.8rem'}:null}>Enter Username</span>
			</label>
			<label htmlFor="password">
				<input type={passShow?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)}></input>
				<span style={password?{top:'0px',left: '.3rem',fontSize: '0.8rem'}:null}>Enter Password</span>
				<img src={`/assets/${passShow?'hide.png':'show.png'}`} onClick={()=>setPassShow(!passShow)} className="pass-show-hide" alt="" />
			</label>
			<div className="submit">
				<button type="button" className="submit-btn btn" onClick={()=>{loginHandle('login')}}>Submit</button>
				<span>OR</span> 
				<button type="button" className="sign-up-btn btn" onClick={()=>{loginHandle('signup')}}>Sign up</button>
			</div>
		</form>
		</div>
	);
}