import Menu from '../../components/menu';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { BookType } from '../../models/bookType';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
	findBooks,
	deleteBook,
	updateStock,
} from '../../repository/bookRepository';

import { default as ButtonMenu } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

import Button from '../../components/button';
import Confirm from '../../components/confirm-dialog';
import {
	BUY,
	saveTransactions,
	SELL,
} from '../../repository/transactionsRepository';

const BookList = () => {
	const [filter, setFilter] = useState<string>('');
	const [books, setBooks] = useState<BookType[]>([]);
	const [bookToDelete, setBookToDelete] = useState<BookType>();
	const [bookToBuy, setBookToBuy] = useState<BookType>();
	const [bookToSell, setBookToSell] = useState<BookType>();
	const [open, setOpen] = useState<string>();
	const [message, setMessage] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [priceBuy, setPriceBuy] = useState<number>(0);
	const [quantityBuy, setQuantityBuy] = useState<number>(0);

	const navigate = useNavigate();
	const find = async () => {
		setLoading(true);
		const booksResponse = await findBooks(filter);
		setLoading(false);
		setBooks(booksResponse);
	};

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClose = () => {
		setAnchorEl(null);
		setOpen('');
	};
	const registerSell = async () => {
		handleClose();
		if (bookToSell === undefined) return;
		try {
			setLoading(true);
			await updateStock(bookToSell.id, -1);
			await saveTransactions(bookToSell, SELL, bookToSell.price, 1);
			setMessage('Venda efetuada !');
			await find();
		} catch (e) {
			setMessage('Falha na venda do Livro');
		}
		setBookToSell(undefined);
		setLoading(false);
	};

	const registerBuy = async () => {
		handleClose();
		if (bookToBuy === undefined) return;
		try {
			setLoading(true);
			await updateStock(bookToBuy.id, quantityBuy);
			await saveTransactions(bookToBuy, BUY, priceBuy, quantityBuy);
			setMessage('Compra efetuada !');
			await find();
		} catch (e) {
			setMessage('Falha na compra do Livro');
		}
		setBookToBuy(undefined);
		setPriceBuy(0);
		setQuantityBuy(0);
		setLoading(false);
	};

	const confirmDelete = async () => {
		if (bookToDelete === undefined) return;
		setLoading(true);
		const response = await deleteBook(bookToDelete.id);
		setLoading(false);
		if (response) {
			setMessage('Livro excluido!');
			setBooks(books.filter((value) => value.id !== bookToDelete.id));
		} else {
			setMessage('Erro ao excluir o livro !');
		}
		setBookToDelete(undefined);
	};

	return (
		<>
			<Menu></Menu>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={message != undefined}
				onClose={(_) => setMessage(undefined)}
				message={message}
				autoHideDuration={3000}
			/>
			<Confirm
				title="Confirmar Exclusão"
				text={'Quer excluir o livro "' + bookToDelete?.name + '" ? '}
				open={bookToDelete != undefined}
				onClose={() => setBookToDelete(undefined)}
				onConfirm={confirmDelete}
				onDecline={() => setBookToBuy(undefined)}
			/>

			<Confirm
				title="Confirmar Venda"
				text={
					'Confirma a venda do livro "' +
					bookToSell?.name +
					'" pelo preço de R$ ' +
					bookToSell?.price +
					'? '
				}
				open={bookToSell != undefined}
				onClose={() => setBookToSell(undefined)}
				onConfirm={registerSell}
				onDecline={() => setBookToSell(undefined)}
			/>

			<Confirm
				title="Confirmar Compra"
				text={'Confirma a compra do livro "' + bookToBuy?.name + '" ? '}
				open={bookToBuy != undefined}
				onClose={() => setBookToBuy(undefined)}
				onConfirm={registerBuy}
				onDecline={() => setBookToBuy(undefined)}
			>
				<Grid container spacing={3} style={{ padding: 20 }}>
					<Grid item xs={12} sm={4}>
						<TextField
							type="number"
							id="quantity"
							name="quantity"
							label="Quantidade"
							fullWidth
							variant="standard"
							onChange={(e) => setQuantityBuy(parseInt(e.target.value))}
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextField
							type="number"
							inputProps={{ step: 0.1, min: 0 }}
							id="price"
							name="price"
							label="Preço Unitario"
							fullWidth
							variant="standard"
							onChange={(e) => setPriceBuy(parseFloat(e.target.value))}
						/>
					</Grid>
				</Grid>
			</Confirm>

			<Grid container spacing={3} style={{ padding: 20 }}>
				<Grid item xs={12} sm={6}>
					<TextField
						id="filter"
						name="filter"
						label="Filtro"
						fullWidth
						variant="standard"
						onChange={(e) => setFilter(e.target.value)}
					/>
				</Grid>

				<Grid item xs={12} sm={6} justifyContent="center" alignItems="center">
					<Button
						label="Pesquisar"
						onClick={find}
						fullWidth
						loading={loading}
					/>
				</Grid>
			</Grid>
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell style={{ width: '20%' }}>Nome Livro</TableCell>
								<TableCell style={{ width: '20%' }}>Autor</TableCell>
								<TableCell style={{ width: '20%' }}>Medium</TableCell>
								<TableCell style={{ width: '20%' }}>Editora</TableCell>
								<TableCell>Preço</TableCell>
								<TableCell>Estoque</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{books
								//.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow hover key={row.id}>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.author}</TableCell>
											<TableCell>{row.medium}</TableCell>
											<TableCell>{row.publishCompany}</TableCell>
											<TableCell>
												{Intl.NumberFormat('pt-BR', {
													style: 'currency',
													currency: 'BRL',
												}).format(row.price)}
											</TableCell>
											<TableCell>{row.stock}</TableCell>
											<TableCell>
												<IconButton
													size="large"
													edge="start"
													color="inherit"
													aria-label="menu"
													sx={{ mr: 2 }}
													onClick={(event: React.MouseEvent<HTMLElement>) => {
														setOpen(row.id);
														setAnchorEl(event.currentTarget);
													}}
												>
													<MenuIcon />
												</IconButton>
												<ButtonMenu
													id="demo-positioned-menu"
													aria-labelledby="demo-positioned-button"
													anchorEl={anchorEl}
													open={open == row.id}
													onClose={handleClose}
													anchorOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
												>
													<MenuItem
														onClick={() =>
															navigate('/cadastro-livros/', {
																state: {
																	book: row,
																},
															})
														}
													>
														Editar
													</MenuItem>
													<MenuItem onClick={() => setBookToBuy(row)}>
														Registrar Compra
													</MenuItem>
													{row.stock > 0 ? (
														<MenuItem onClick={() => setBookToSell(row)}>
															Registar Venda
														</MenuItem>
													) : null}
													<MenuItem
														onClick={() => {
															handleClose();
															setBookToDelete(row);
														}}
													>
														Excluir
													</MenuItem>
												</ButtonMenu>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				{/* <TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/> */}
			</Paper>
		</>
	);
};

export default BookList;
