import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login, profilePosts } from "../global/UserSlice";
import axios from "axios";
import { apiurl } from "../components/assets";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export const Login = ()=>{
	const [username,setUserName] = useState('');
	const [password,setPassword] = useState('');
	const [passShow,setPassShow] = useState(false);
	const input = useRef();
	const dispatch = useDispatch();

	const loginHandle = (action)=>{
		const data = {username:username,password:password};
		axios.post(apiurl+action,data).then((res)=>{
			if(res.data.status){
				// localStorage.setItem('userdata',JSON.stringify(res.data.data));
				// localStorage.setItem('posts',JSON.stringify(res.data.posts));
				// localStorage.setItem('token',JSON.stringify(res.data.token));
				dispatch(login({'user':res.data.data,'token':res.data.token}));
				dispatch(profilePosts(res.data.posts));
			}
		}).catch(e=>{
			console.log('login error: ',e.message);
			dispatch(login(data));
		})
	}
	
	useEffect(()=>{
		input.current.focus();
	},[]);

	return(
		<>
		<View style={styles.logincontainer}>
			<View style={styles.loginmodal}>
				<Text style={styles.headText}>Login</Text>
				<View>
					<TextInput value={username} style={styles.textInput} onChange={(e)=>setUserName(e.nativeEvent.text)} ref={input} placeholder="Enter Username"></TextInput>
				</View>
				<View>
					<TextInput value={password} secureTextEntry={passShow?false:true} style={styles.textInput} onChange={(e)=>setPassword(e.nativeEvent.text)} placeholder="Enter Password"></TextInput>
					<Pressable onPress={()=>setPassShow(!passShow)} style={styles.passIconbtn}>
						{passShow?
						<Image source={require('../assets/show.png')} style={styles.passIcon} alt=""></Image>:
						<Image source={require('../assets/hide.png')} style={styles.passIcon} alt=""></Image>}
					</Pressable>
				</View>
				<View style={styles.submit}>
					<Pressable onPress={()=>{loginHandle('login')}}>
						<Text style={[styles.btnSubmit]}>Submit</Text>
					</Pressable>
					<Text style={styles.submitBtnText}>OR</Text> 
					<Pressable onPress={()=>{loginHandle('signup')}}>
						<Text style={styles.submitBtnText}>Sign up</Text>
					</Pressable>
				</View>
			</View>
		 </View>
		 </>
	);
}

const styles = StyleSheet.create({
	logincontainer:{
		position:'absolute',
		width:'100%',
		height:'100%',
		backgroundColor:'#ddd',
		flexDirection:'column',
		justifyContent:'center'
	},
	loginmodal:{
		margin:10,
		marginTop:-80,
		padding:20,
		backgroundColor:'#fff',
		borderRadius:16
	},
	headText:{
		textAlign:'center',
		fontSize:24
	},
	textInput:{
		fontSize:18,
		marginVertical:20,
		borderBottomWidth:2,
		borderBottomColor:'#777',
		backgroundColor:'transparent'
	},
	inputFocused:{
		width:150,
		position:'absolute',
		top:0,
		left:0,
		pointerEvents:'none',
	},
	inputNotFocused:{
		width:150,
		position:'absolute',
		top:33,
		left:10,
		color:'grey',
		pointerEvents:'none',
		backgroundColor:'green'
	},
	passIconbtn:{
		position:'absolute',
		right:10,
		bottom:30
	},
	passIcon:{
		width:30,
		height:30
	},
	submit:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		gap:10
	},
	btnSubmit:{
		width:100,
		fontSize:16,
		paddingVertical:8,
		color:'#fff',
		borderRadius:6,
		backgroundColor:'salmon',
		textAlign:'center'
	},
	submitBtnText:{
		fontSize:16
	},

});