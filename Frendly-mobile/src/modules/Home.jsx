import { rooturl } from "../components/assets";
import { useContext } from "react";
import { AppContext } from "../Context";
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export const Home = ({navigation})=>{
	const {feedPosts} = useContext(AppContext);
	const dimensions = useWindowDimensions();
	if(feedPosts?.length){
	return(
		<ScrollView style={styles.postContainer}>
			{
				feedPosts.length && feedPosts.map((post,index)=>{
					return(
					<View style={styles.postBlock} key={index}>
						<View style={styles.postHead}>
							<View style={styles.postTitle}>
								<Image style={{width:30,height:30}} source={require("../assets/user.png")} alt=""></Image>
								<Text>{post.username}</Text>
							</View>
							<Image style={{width:15,height:15}} source={require("../assets/ellipsis.png")} alt=""></Image>
						</View>
						<ScrollView horizontal={true} style={styles.postContent}>
							{post.post_content.length && post.post_content.map((img,index)=>{
								return(
									<Image source={{uri:`${rooturl+img}`}} style={{width:dimensions.width,height:300}} key={index} alt=""></Image>
								)
							})
							}
						</ScrollView>
						<View style={styles.postActionbtns}>
							<View style={styles.postActionbtns}>
								<Text style={{}} onPress={()=>{}}>
									{post.isLiked?
									<Image source={require("../assets/heart-pink.png")} style={styles.postaction} alt=""></Image>
									: 
									<Image source={require("../assets/heart.png")} style={styles.postaction} alt=""></Image>
									}
								</Text>
								<Text>{post.likes}</Text>
								<View style={{}}>
									<Image source={require("../assets/comment.png")} style={styles.postaction} alt=""></Image>
								</View>
								<Text>{post.comments}</Text>
							</View>
							<View style={{}}>
								<Image source={require("../assets/bookmark.png")} style={styles.postaction} alt=""></Image>
							</View>
						</View>
						<View style={{}}>
							<Text><Text onPress={()=>{navigation.navigate('/profile/'+post.username)}}>{post.username}</Text> {post.caption}</Text>
							<Text style={{}}>{post.hashtags.join(' ')}</Text>
						</View>
					</View>)
				})
			}
		</ScrollView>
	);
}
}

const styles = StyleSheet.create({
	postContainer:{
		marginBottom:50
	},
	postBlock:{
		marginBottom:10
	},
	postHead:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		padding:8,
		borderBottomColor:'lightgrey',
		borderBottomWidth:1
	},
	postTitle:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		gap:10
	},
	postContent:{
		flexDirection:'row',
	},
	postActionbtns:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		padding:4,
		gap:10
	},
	postaction:{
		width:30,
		height:30
	}
});