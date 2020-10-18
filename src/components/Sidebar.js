import React,{ useState, useEffect } from 'react';
import "./Sidebar.css";

import { Avatar, IconButton } from "@material-ui/core";
import { DonutLarge, Chat, MoreVert, SearchOutlined } from "@material-ui/icons"
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../StateProvider";

import db from "../firebase/Firebase";


const Sidebar = () => {
	const [rooms, setRooms] = useState([]);
	const [{ user }, dispatch] = useStateValue();

	useEffect(() => {
		const unsubscribe = db.collection('rooms').onSnapshot(snapShot => (

			setRooms(snapShot.docs.map((doc) => 
				({
					id: doc.id, //Id from firebase
					data: doc.data(),
				})
				))
		))

		return () => {
			unsubscribe();
		}
		
	}, [])

	return (
		<div className="sidebar">
			<div className="sidebar__header">
				<Avatar src = {user?.photoURL}/>
					<div className="sidebar__headerRight">
						<IconButton>
							<DonutLarge />
						</IconButton>
						<IconButton>
							<Chat />
						</IconButton>
						<IconButton>
							<MoreVert />
						</IconButton>
					</div>
			</div>

			<div className="sidebar__search">
				<div className="sidebar__searchContainer">
					<SearchOutlined />
					<input type="text" placeholder="Search or start a new chat" />
				</div>
			</div>

			<div className="sidebar__chats">
				<SidebarChat addNewChat/>
				{rooms.map(room => (
					<SidebarChat key={room.id} id={room.id} name={room.data.name} />
				))}
			</div>

		</div>
	)

}
export default Sidebar;