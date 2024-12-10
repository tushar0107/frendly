import { StyleSheet, useColorScheme } from "react-native";


const scheme = useColorScheme();

export const headerStyles = StyleSheet.create({
	headerContainer:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		paddingVertical:10,
		backgroundColor:scheme==='dark'?'#111111':'#eeeeee',
		borderColor:'red',
		borderWidth:1
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
		fontSize:28,
		paddingVertical:8,
	}
});

export const FooterStyles = StyleSheet.create({
	footerContainer:{
		position:'absolute',
		zIndex:100000,
		left:0,
		right:0,
		bottom:0,
		flexDirection:'row',
		justifyContent:'space-around',
		
	}
});