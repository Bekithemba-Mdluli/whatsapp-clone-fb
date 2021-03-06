import React, {useState, useEffect} from 'react';
import { IconButton, Avatar } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined, InsertEmoticon, Mic } from "@material-ui/icons";
import { useParams } from "react-router-dom";

import db from "../firebase/Firebase";

import "./Chat.css";
import firebase from "firebase";
import { useStateValue } from "../StateProvider";


const Chat = () => {
	const [input, setInput] = useState("");
	const {roomId} = useParams();
	const [roomName, setRoomName] = useState("");
	const [messages, setMessages] = useState([]);
	const [{ user }, dispatch] = useStateValue();

	useEffect(() => {
		if (roomId) {
			db.collection("rooms").doc(roomId).onSnapshot(snapshot => (
				setRoomName(snapshot.data().name)))
			db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => (
				setMessages(snapshot.docs.map(doc => doc.data()))))
		}
	}, [roomId])

	const sendMessage = async (e) => {
		e.preventDefault();

		db.collection('rooms').doc(roomId).collection('messages').add({
			message: input,
			name: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		})

		setInput("");
	}

	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar />

				<div className="chat__headerInfo">
					<h3>{roomName}</h3>
					<p>Last seen at {" "} {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}</p>
				</div>

				<div className="chat__headerRight">
					<IconButton>
						<SearchOutlined />
					</IconButton>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</div>
			</div>
			<div className="chat__body">
				{messages.map(message => (
					<p className={`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
						<span className="chat__name">{message.name}</span>
						{message.message}
						<span className="chat__timestamp">
							{new Date(message.timestamp?.toDate()).toUTCString()}>
						</span>
					</p>
				))}

					<p className="chat__message chat__reciever">
						<span className="chat__name">Test 2</span>
						This is a message
						<span className="chat__timestamp">
							14:12
						</span>
					</p>

			</div>

			<div className="chat__footer">
				<InsertEmoticon />
				<form>
					<input value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message" />
					<button onClick={sendMessage} type="submit" >send a message </button>
				</form>
				<Mic />
			</div>
		</div>
	)

}
export default Chat;