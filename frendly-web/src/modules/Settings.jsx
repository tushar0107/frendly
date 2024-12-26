import { logout } from "../global/UserSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { HeadBar } from "./Base";



export const Settings = ()=>{
	const dispatch = useDispatch();

	return(
		<>
		<HeadBar title={'Settings'}/>
			<div id="profile-settings">
				<div id="settings-body">
					<Link to={'/'} onClick={()=>{dispatch(logout())}}><img src="/assets/logout.png" alt="" className="tiny-icon"></img><span>Logout</span></Link>
					<Link to={'/changepassword'}><img src="/assets/lock.png" alt="" className="tiny-icon"></img><span>Change Password</span></Link>
				</div>
			</div>
		</>
	);
}