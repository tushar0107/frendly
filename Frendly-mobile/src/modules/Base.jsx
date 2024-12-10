import { useContext, useTransition } from "react";
// import { Link, useNavigate } from "react-router-dom";
import {AppContext} from '../Context';
import { useSelector } from "react-redux";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
	const {user} = useSelector(state=>state.user);
	const navigation = useNavigation();

	return(
		<View style={styles.headerContainer}>
          <Image style={styles.headerLogoImg} source={require('../assets/logo.png')}></Image>
		  {user? <Pressable onPress={()=>{navigation.navigate('Contact')}}><Image style={styles.headerImg} source={require('../assets/live-chat.png')}></Image></Pressable> : null}
        </View>
	);
}

const Footer = ()=>{
	const [isPending,setTransition] = useTransition();
	const {page,setPage} = useContext(AppContext);
	const changePage = (page)=>{setTransition(()=>{
		setPage(page);
	})};
	return(
		<View style={styles.footer}>
			<Pressable onPress={()=>{changePage('Home')}} style={[styles.footerTab,page==='Home'?styles.tabActive:null]}><Image style={styles.footerImg} source={require('../assets/house.png')} alt=""></Image></Pressable>
			<Pressable onPress={()=>{changePage('Create')}} style={[styles.footerTab,page==='Create'?styles.tabActive:null]}><Image style={styles.footerImg} source={require("../assets/add-post.png")} alt=""></Image></Pressable>
			<Pressable onPress={()=>{changePage('Search')}} style={[styles.footerTab,page==='Search'?styles.tabActive:null]}><Image style={styles.footerImg} source={require("../assets/search.png")} alt=""></Image></Pressable>
			<Pressable onPress={()=>{changePage('Profile')}} style={[styles.footerTab,page==='Profile'?styles.tabActive:null]}><Image style={styles.footerImg} source={require("../assets/user.png")} alt=""></Image></Pressable>
		</View>
	);
}
const styles = StyleSheet.create({
	headerContainer:{
		  flexDirection:'row',
		  justifyContent:'space-between',
		  alignItems:'center',
		  paddingVertical:8,
		  paddingHorizontal:10,
	  },
	  headerImg:{
		  width:40,
		  height:40
	  },
	headerLogoImg:{
	  width: 100,
	  height:50
	},
	  headerText:{
		  fontSize:24,
	  paddingHorizontal:12,
	  },
	footer:{
		position:'absolute',
		left:0,
		right:0,
		bottom:0,
		flexDirection:'row',
		justifyContent:'space-around',
		backgroundColor:'#eee'
	},
	footerTab:{
		width:'25%',
		paddingVertical:12,
	},
	tabActive:{
		borderTopColor:'black',
		borderTopWidth:2
	},
	footerImg:{
		width:25,
		height:25,
		margin:'auto'
	},
});

export {Footer, Header};