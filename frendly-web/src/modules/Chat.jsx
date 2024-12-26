import { useParams } from "react-router-dom";
import { HeadBar } from "./Base";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiurl } from "../components/assets";


export const Chat = ()=>{
	const {username} = useParams();
	const [chatUser,setChatUser] = useState();
	const [message,setMessage] = useState('');
	const [chats,setChats] = useState([]);

	const send = ()=>{
		setChats([...chats,{'type':'sent','message':message}]);
		setMessage('');
	}

	useEffect(()=>{
		axios.get(apiurl+'get-user/'+username).then((res)=>{
			if(res.data.status){
				setChatUser(res.data.data);
			}
		}).catch(e=>{
			console.log(e.message);
		});
	},[]);

	return(
		<>
			<HeadBar title={username} detail={chatUser}/>
			<div id="chat-container">
				<div id="chat-area">
					{chats.map((msg,idx)=>{
						return(
							<div className={"message "+msg.type} key={idx}>
								<span>{msg.message}</span>
							</div>		
						)
					})}
				</div>
				<label id="chat-action" htmlFor="message-input">
					<input type="text" value={message} id="message-input" onChange={(e)=>{setMessage(e.target.value)}} placeholder="Message.."></input>
					<button onClick={()=>{send()}} disabled={message?false:true}><img src="/assets/next.png" className="tiny-icon" alt=""></img></button>
				</label>
			</div>
		</>
	);
};