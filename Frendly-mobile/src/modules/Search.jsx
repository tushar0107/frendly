import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { apiurl, rooturl } from "../components/assets";
import { AppContext } from "../Context";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const Search = ()=>{
	const {search,setSearch,searchResult, setSearchResult} = useContext(AppContext);
	const [category,setCategory] = useState(search.category || 'Posts');
	const dimension = useWindowDimensions();
	const navigation = useNavigation();
	
	const searchHandle = ()=>{
		setSearch({'search':search.search,'category':category});
		const form = {
			search:[search.search],
			category:category
		}
		axios.post(apiurl+'get-posts',form).then((res)=>{
			if(res.data.data){
				console.log(res.data);
				setSearchResult(res.data.data);
			}else{
				console.log(res.data.message);
			}
		}).catch(e=>{console.log('Error in search: ',e)});
	}

	useEffect(()=>{
	},[search.search]);

	return(
		<View style={styles.searchPage}>
			<View style={styles.searchBar}>
				<TextInput style={[styles.searchInput,{width:(dimension.width-50)}]} value={search.search} onChange={(e)=>setSearch({'search':e.nativeEvent.text,'category':category})} placeholder="Search.."></TextInput>
				<Pressable onPress={()=>searchHandle()}><Image source={require("../assets/next.png")} style={styles.smallIcon} alt="" /></Pressable>
			</View>
			<View horizontal={true} style={styles.searchCategory}>
				<Pressable style={[styles.tabchip,category==='Posts'?styles.checked:null]} onPress={(e)=>(setCategory('Posts'))}><Text style={{}}>Posts</Text></Pressable>
				<Pressable style={[styles.tabchip,category==='Accounts'?styles.checked:null]} onPress={(e)=>(setCategory('Accounts'))}><Text style={{}}>Accounts</Text></Pressable>
				<Pressable style={[styles.tabchip,category==='Videos'?styles.checked:null]} onPress={(e)=>(setCategory('Videos'))}><Text style={{}}>Videos</Text></Pressable>
				<Pressable style={[styles.tabchip,category==='Tags'?styles.checked:null]} onPress={(e)=>(setCategory('Tags'))}><Text style={{}}>Tags</Text></Pressable>
			</View>
			<ScrollView style={styles.searchResult}>
				{category==='Posts'?
					searchResult?.posts && 
						<View style={styles.searchedPosts}>
						{
							searchResult.posts.map((post,index)=>{
								return(
									<View style={[styles.post,{width:dimension.width/3}]} key={index}>
										<Image source={{uri:`${rooturl+post.post_content[0]}`}} style={{width:dimension.width/3,height:dimension.width/3}} alt=""></Image>
										<Image source={require("../assets/posts-many.png")} style={[styles.postIcon,styles.numposts]} alt=""></Image>
									</View>
								)
							})
						}
						</View>				
				:category==='Accounts'?
					searchResult?.accounts && 
					(<View style={styles.accounts}>
						{searchResult.accounts.map((account,index)=>{
							return(
							<Pressable style={styles.profile} onPress={()=>navigation.navigate('Profile',{account:account})} key={index}>
								<Image source={require("../assets/user.png")} style={styles.mediumIcon} alt="" ></Image>
								<View style={styles.profileDetails}>
									<Text style={styles.name}>Actual Name</Text>
									<Text style={styles.username}>{account.username}</Text>
								</View>
							</Pressable>)
						})}
					</View>)

				:category==='Tags'?
					searchResult?.tags && 
					<View style={styles.searchedPosts}>
					{
						searchResult.tags.map((post,index)=>{
							return(
								<View style={[styles.post,{width:dimension.width/3}]} key={index}>
									<Image source={{uri:`${rooturl+post.post_content[0]}`}} style={{width:dimension.width/3,height:dimension.width/3}} alt=""></Image>
									<Image source={require("../assets/posts-many.png")} style={[styles.postIcon,styles.numposts]} alt=""></Image>
								</View>
							)
						})
					}
					</View>	
				:null
				}
			</ScrollView>
		</View>
	);
}


const styles = StyleSheet.create({
	searchPage:{
		backgroundColor:'#ddd'
	},
	searchBar:{
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		marginVertical:8
	},
	searchInput:{
		padding:8,
		fontSize:18
	},
	smallIcon:{
		width:30,height:30
	},
	searchCategory:{
		flexDirection:'row',
		justifyContent:'space-evenly',
	},
	tabchip:{
		paddingHorizontal:18,
		paddingVertical:6,
		borderWidth:2,
		borderColor:'lightgrey',
		borderRadius:20,
	},
	checked:{
		paddingHorizontal:18,
		paddingVertical:6,
		borderWidth:2,
		borderColor:'grey',
		borderRadius:20,
		backgroundColor:'lightgrey'
	},
	searchResult:{
		height:'100%'
	},
	searchedPosts:{
		marginTop: 20,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	post:{
	},
	postIcon:{
		position:'absolute',
		top:5,
		right:5,
		width:15,
		height:15
	},
	profile:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'flex-start',
		gap:20,
		padding:10,
		marginTop:20,
		borderTopColor:'lightgrey',
		borderTopWidth:1
	},
	mediumIcon:{
		width:80,
		height:80
	},
	profileDetails:{
		paddingVertical:12
	},
	name:{
		fontSize:18
	}
});