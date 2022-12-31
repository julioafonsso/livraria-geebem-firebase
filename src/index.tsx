import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoute from './routes';
import GlobalProvider from './context';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<GlobalProvider>
			<AppRoute />
		</GlobalProvider>
	</React.StrictMode>
);
