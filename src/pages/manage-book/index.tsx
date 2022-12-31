import Menu from '../../components/menu';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { BookType } from '../../models/bookType';
import { saveBook } from '../../repository/bookRepository';
import { useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Button from '../../components/button';

const ManageBook: React.FC = () => {
	const createEmptyBook = () => ({
		id: '',
		name: '',
		author: '',
		medium: '',
		publishCompany: '',
		price: 0,
		stock: 0,
	});

	const [loading, setLoading] = useState(false);
	const [book, setBook] = useState<BookType>(createEmptyBook());

	const [message, setMessage] = useState<string | undefined>();
	const loc = useLocation();

	useEffect(() => {
		if (loc.state != null && loc.state['book'] != undefined)
			setBook(loc.state['book']);
	}, []);

	const save = async () => {
		setLoading(true);
		const response = await saveBook(book);
		setLoading(false);
		if (response) {
			setMessage('Livro Cadastrado');
			setBook(createEmptyBook());
		} else {
			setMessage('Erro ao cadastrar o livro');
		}
	};

	return (
		<>
			<Menu></Menu>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={message != undefined}
				onClose={(_) => setMessage(undefined)}
				message={message}
				autoHideDuration={6000}
			/>
			<Typography variant="h6" gutterBottom padding={5}>
				Cadastro Livro
			</Typography>
			<Grid container spacing={3} justifyContent="center" padding={5}>
				<Grid item xs={12} sm={3}>
					<TextField
						id="name"
						name="name"
						label="Nome"
						fullWidth
						variant="standard"
						value={book.name}
						onChange={(e) => setBook({ ...book, name: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						id="publishCompany"
						name="publishCompany"
						label="Editora"
						fullWidth
						variant="standard"
						value={book.publishCompany}
						onChange={(e) =>
							setBook({ ...book, publishCompany: e.target.value })
						}
					/>
				</Grid>
				<Box width="100%" />
				<Grid item xs={12} sm={3}>
					<TextField
						id="author"
						name="author"
						label="Autor"
						fullWidth
						variant="standard"
						value={book.author}
						onChange={(e) => setBook({ ...book, author: e.target.value })}
					/>
				</Grid>
				<Grid item xs={12} sm={3}>
					<TextField
						id="medium"
						name="medium"
						label="Medium"
						fullWidth
						variant="standard"
						value={book.medium}
						onChange={(e) => setBook({ ...book, medium: e.target.value })}
					/>
				</Grid>
				<Box width="100%" />
				<Grid item xs={12} sm={3}>
					<TextField
						id="price"
						name="price"
						label="Preco"
						type="number"
						inputProps={{ step: 0.1, min: 0 }}
						fullWidth
						variant="standard"
						value={book.price}
						onChange={(e) =>
							setBook({ ...book, price: parseFloat(e.target.value) })
						}
					/>
				</Grid>
				<Box width="100%" />
				<Grid item xs={12} sm={6} justifyContent="center" alignItems="center">
					<Button
						onClick={save}
						label="Cadastrar"
						loading={loading}
						fullWidth={true}
					/>
				</Grid>
			</Grid>
		</>
	);
};

export default ManageBook;
