import { Link } from "react-router-dom";


export const Contact = ({contacts})=>{
	return(
		<section id="contact-page">
			{(contacts?.length && contacts.map(((contact,index)=>{
				return(
					<Link to={`/chat/${contact.mobile}`} className="contact-item" key={index}>{contact.first_name+' '+contact.last_name}</Link>
				)
			}))) ||( 'No Contacts')}
		</section>
	);
}