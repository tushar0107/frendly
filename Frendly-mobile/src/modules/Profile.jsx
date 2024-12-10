import { useDispatch, useSelector } from "react-redux";
import { Login } from "./Login";
import axios from "axios";
import { useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { logout } from "../global/UserSlice";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export const Profile = ({route})=>{
	const account = route?.params.account;
	const dispatch = useDispatch();
	//fetch user data from redux store
	var myProfile = useSelector(state=>state.user.user);
	var myPosts = useSelector(state=>state.user.posts);
	const [profile,setProfile] = useState(myProfile);
	const [posts,setPosts] = useState([...myPosts]);
	const [postsLoading,setPostsLoading] = useState(false);

	//if other user's profile is to be opened set the user to the url parameter
	useEffect(()=>{
		if(account){
			setProfile(account);
		}
		if(account){
			setPostsLoading(true);
			axios.get(apiurl+'get-user/'+account?.username).then((res)=>{
				if(res.data.status){
					setPosts(res.data.posts || []);
				}else{
					//if failed to fetch any profile set it to null
					// so the default behaviour of showing my profile will be overridden
					// setProfile(null);
					setPosts(null);
				}
				setPostsLoading(false);
			}).catch(e=>console.log('Error fetching user details: ',e.message));
		}

	},[account]);

	if(profile){
		return(
			<ScrollView>
				<View style={styles.profilecontainer}>
					<View style={styles.profilebanner}>
						<Image source={require("../assets/user.png")} style={styles.profilephoto} alt=""></Image>
						<Text style={styles.profileusername}>{profile?.username || 'username'}</Text>
						{!account?<Pressable style={styles.logoutbtn} onPress={()=>{dispatch(logout())}}><Image source={require("../assets/logout.png")} style={styles.logoutbtnImg} alt=""></Image></Pressable>:null}
					</View>
					{postsLoading?
					<View style={styles.postsloading}>

					</View>
					:
					<View style={styles.postssegment}>
					{ posts?.length ? 
						<View style={[styles.profileposts,styles.segmentblock]}>
						{
							posts.map((post,index)=>{
								return(
									<View style={styles.post} key={index}>
										<Image source={{uri:`${rooturl+post.post_content[0]}`}} style={styles.postImage} alt=""></Image>
										<Image source={require("../assets/posts-many.png")} style={[styles.postIcon,styles.numposts]} alt=""></Image>
										<View style={styles.likes}><Image source={require("../assets/tiny-heart.png")} style={[styles.postIcon]} alt=""></Image><Text style={{color:'white'}}>{post.likes}</Text></View>
									</View>
								)
							})
						}
						</View> :null
					}
					</View>
					}
				</View>
			</ScrollView>
		)
	}else {
		return(
			<Login/>
		)
	}

}

const styles = StyleSheet.create({
	profilecontainer:{
		width:'100%',
		height:'100%',
		padding:10,
		backgroundColor:'#ddd',
		
	},
	profilebanner:{
		backgroundColor:'wheat',
		padding:10,
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'flex-end',
		gap:10,
		borderRadius:10
	},
	profilephoto:{
		width:120,
		height:120,
		marginTop:40,
		marginBottom:-60
	},
	profileusername:{
		color:'black',
		fontSize:18,
		fontWeight:'bold'
	},
	logoutbtn:{
		position:'absolute',
		top:10,
		right:10,
	},
	logoutbtnImg:{
		width:25,
		height:25
	},
	postsloading:{},
	postssegment:{},
	profileposts:{
		marginTop:80,
		flexDirection:'row'
	},
	post:{
		width:'33.33%',
		aspectRatio:1
	},
	postImage:{
		width:'100%',
		aspectRatio:1
	},
	segmentblock:{},
	numposts:{
		position:'absolute',
		right:5,
		top:5
	},
	postIcon:{
		width:15,
		height:15
	},
	likes:{
		flexDirection:'row',
		alignItems:'center',
		gap:5,
		left:10,
		bottom:20
	},

});