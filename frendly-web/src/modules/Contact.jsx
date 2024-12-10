import { useNavigate } from "react-router-dom";


export const Contact = ({contacts})=>{
	const navigate = useNavigate();
	return(
		<section id="contact-page">
			<div className="accounts">
				{(contacts?.length && contacts.map(((contact,index)=>{
					return(
						<div className="profile" onClick={()=>navigate('/chat/'+contact.username)} key={index}>
							<img src="/assets/user.png" className="small-icon" alt="" />
							<div className="profile-details">
								<span>{'Actual Name'}</span><br />
								<span className="username">{contact.username}</span>
							</div>
						</div>
					)
				}))) ||( 'No Contacts')}
			</div>
		</section>
	);
}