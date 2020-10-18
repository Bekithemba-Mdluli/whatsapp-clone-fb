import React from "react";
import { Button } from "@material-ui/core";
import "./Login.css";
import { auth, provider } from "../firebase/Firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";


const Login = () => {
	const [{}, dispatch] = useStateValue();

	const signIn = () => {
		auth
		.signInWithPopup(provider)
		.then(result => {
			dispatch({
				type: actionTypes.SET_USER,
				user: result.user,
			})
		})
		.catch(error => alert(error.message))
	}

	return(
		<div className="login">
			<div className="login__container">
				<img src="https://www.freeiconspng.com/thumbs/logo-whatsapp-png/logo-whatsapp-transparent-background-22.png" alt=""/>

				<div>
					<h1>Sign in to WhatsApp</h1>
				</div>

				<Button onClick={signIn}>
					Sign In With Google
				</Button>
			</div>
		</div>
	)
}

export default Login;