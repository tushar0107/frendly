import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { apiurl, getItem, setItem } from "../components/assets";
import axios from "axios";


export const Contact = ({navigation})=>{
	const [contacts,setContacts] = useState();
	const {user} = useSelector(state=>state.user);

	useEffect(()=>{
		getItem('contacts').then((res)=>{setContacts(res);});
		// fetch contacts if not in the localstorage
		if(!contacts?.length){
			axios.post(apiurl+'get-contacts',{username:user?.username}).then((res)=>{
				if(res.data.status){
					setItem('contacts',res.data.data);
					setContacts(res.data.data);
				}else{
					console.log(res.data.message);
				}
			}).catch(e=>console.log('Error fetching posts: ',e.message));
		}
	},[]);


	return(
		<ScrollView style={styles.contactPage}>
			<View style={styles.accounts}>
				{(contacts?.length && contacts.map(((contact,index)=>{
					return(
						<Pressable style={styles.profile} onPress={()=>navigation.navigate('/chat/'+contact.username)} key={index}>
							<Image source={require("../assets/user.png")} style={styles.smallIcon} alt="" ></Image>
							<View style={styles.profileDetails}>
								<Text style={styles.name}>Actual Name</Text>
								<Text style={styles.username}>{contact.username}</Text>
							</View>
						</Pressable>
					)
				}))) ||( <Text>No Contacts</Text>)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	contactPage:{},
	accounts:{},
	smallIcon:{},

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
	smallIcon:{
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