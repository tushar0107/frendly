import AsyncStorage from "@react-native-async-storage/async-storage";

// export const apiurl = 'https://frendly-server.onrender.com/api/v1/';
// export const rooturl =  'https://frendly-server.onrender.com';
export const apiurl = 'https://192.168.1.11:8627/api/v1/';
export const rooturl =  'https://192.168.1.11:8627';

export const setItem = async(key,value)=>{
	try{
		var jsonvalue = JSON.parse(value);
		await AsyncStorage.setItem(key=key,value=jsonvalue);
	}catch{
		(e)=>{
			return e.message
		}
	}
}

export const getItem = async(key)=>{
	try{
		return await AsyncStorage.getItem('contacts');
	}catch{
		(error=>{
			return error.message
		})
	}
}