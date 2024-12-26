import { Link, useNavigate } from "react-router-dom";
import { HeadBar } from "./Base";


export const Contact = ({contacts})=>{
	const navigate = useNavigate();
	return(
		<>
		<HeadBar title={'Contacts'}/>
		<section id="contact-page">
			<div className="accounts">
				{(contacts?.length && contacts.map(((contact,index)=>{
					return(
						<Link to={'/chat/'+contact.username} className="profile" key={index}>
							<img src="/assets/user.png" className="small-icon" alt="" />
							<div className="profile-details">
								<div><span>{contact.name}</span></div>
								<span className="username">{contact.username}</span>
							</div>
						</Link>
					)
				}))) ||( 'No Contacts')}
			</div>
		</section>
		</>
	);
}