import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import ManageBook from '../../pages/manage-book';
import BookList from '../../pages/book-list';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ItemMenuType } from '../../models/itemMenuType';
import TransactionList from '../../pages/transaction-list';
import { auth } from '../../config/firebase';

export const itemsMenu: ItemMenuType[] = [
	{
		label: 'Cadastrar Livro',
		url: '/cadastro-livros',
		element: <ManageBook />,
	},
	{
		label: 'Consultar Livros',
		url: '/lista-livros',
		element: <BookList />,
	},
	{
		label: 'Consultar Transações',
		url: '/list-transactions',
		element: <TransactionList />,
	},
];

const list = (navigate: NavigateFunction) => (
	<Box sx={{ width: 250 }} role="presentation">
		<List>
			{itemsMenu
				.filter((item) => item.label !== undefined)
				.map((item) => (
					<ListItem key={item.url} disablePadding>
						<ListItemButton>
							<ListItemText
								onClick={() => navigate(item.url)}
								primary={item.label}
							/>
						</ListItemButton>
					</ListItem>
				))}
		</List>
	</Box>
);

const Menu = () => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const logout = async () => {
		await auth.signOut();
		sessionStorage.removeItem('UserID');
		navigate('/');
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
						onClick={() => setOpen(true)}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Livraria GEEBEM
					</Typography>
					<Button color="inherit" onClick={logout}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
			<Drawer anchor={'left'} open={open} onClose={() => setOpen(false)}>
				{list(navigate)}
			</Drawer>
		</Box>
	);
};

export default Menu;
