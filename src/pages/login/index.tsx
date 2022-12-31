import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { GlobalContext, useGlobalContext } from '../../context';

const Login = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const { setUserId } = useContext(GlobalContext);

	useEffect(() => {
		auth.signOut();
		sessionStorage.removeItem('UserID');
	}, []);

	const login = async () => {
		try {
			const response = await signInWithEmailAndPassword(auth, user, password);
			setUserId(response.user.uid);
			navigate('/cadastro-livros');
		} catch {
			setError(true);
		}
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={error}
				onClose={(_) => setError(false)}
				message="Loging invalido!"
				autoHideDuration={6000}
			/>
			<Grid
				container
				direction="column"
				justifyContent="center"
				alignItems="center"
				style={{
					minWidth: '100%',
					height: '100vh',
				}}
				rowSpacing={1}
			>
				<Grid item justifyContent="center" alignItems="center">
					<TextField
						id="outlined-basic"
						label="Usuario"
						variant="outlined"
						onChange={(e) => setUser(e.target.value)}
					/>
				</Grid>
				<Grid item justifyContent="center" alignItems="center">
					<TextField
						type="password"
						id="outlined-basic"
						label="Password"
						variant="outlined"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Grid>
				<Grid item justifyContent="center" alignItems="center">
					<Button variant="contained" onClick={login}>
						Login
					</Button>
				</Grid>
			</Grid>
		</>
	);
};
export default Login;
