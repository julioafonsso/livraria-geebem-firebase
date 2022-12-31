import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { itemsMenu } from './components/menu';
import { auth } from './config/firebase';
import { useGlobalContext } from './context';
import Login from './pages/login';

const AppRoute = () => {
	const [userId, setUserId] = useState(undefined);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setUserId(user.uid);
		}
	});
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />

				{itemsMenu.map((item) => (
					<Route
						key={item.url}
						path={item.url}
						element={
							userId !== undefined ? (
								item.element
							) : (
								<Navigate key={item.url} to="/login" />
							)
						}
					/>
				))}
				<Route path="/" element={<Login />} />
			</Routes>
		</Router>
	);
};

export default AppRoute;
