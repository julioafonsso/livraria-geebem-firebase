import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Menu from '../../components/menu';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Snackbar from '@mui/material/Snackbar';

import Button from '../../components/button';
import Confirm from '../../components/confirm-dialog';
import { TransactionType } from '../../models/transactionsType';
import {
	deleteTransaction,
	findTransactions,
	SELL,
} from '../../repository/transactionsRepository';
import { updateStock } from '../../repository/bookRepository';

const TransactionList = () => {
	const [transactions, setTransactions] = useState<TransactionType[]>([]);
	const [dateStart, setDateStart] = useState<string>('');
	const [dateEnd, setDateEnd] = useState<string>('');
	const [message, setMessage] = useState<string | undefined>();
	const [loading, setLoading] = useState(false);
	const [transactionToDelete, setTransactionToDelete] =
		useState<TransactionType>();

	useEffect(() => {
		const today = new Date();
		const d0 = new Date();
		const d1 = new Date();

		d0.setDate(today.getDate() - 30);
		d1.setDate(today.getDate() + 1);

		setDateStart(d0.toISOString().split('T')[0]);
		setDateEnd(d1.toISOString().split('T')[0]);
	}, []);
	const find = async () => {
		setLoading(true);
		const response = await findTransactions(
			new Date(dateStart),
			new Date(dateEnd)
		);
		setLoading(false);
		setTransactions(response);
	};

	const handlerDelete = async () => {
		if (transactionToDelete === undefined) return;

		try {
			setLoading(true);
			const quantity =
				transactionToDelete.type == SELL
					? -transactionToDelete.quantity
					: transactionToDelete.quantity;
			await deleteTransaction(transactionToDelete.id);
			await updateStock(transactionToDelete.idBook, quantity);
			setMessage('Transação excluida!');
			setTransactionToDelete(undefined);
			await find();
		} catch (e) {
			console.log(e);
			setMessage('Erro na exclusão da Transação!');
		}
		setLoading(false);
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
				text={'Quer excluir a transaction ? '}
				open={transactionToDelete != undefined}
				onClose={() => setTransactionToDelete(undefined)}
				onConfirm={handlerDelete}
				onDecline={() => setTransactionToDelete(undefined)}
			/>

			<Grid container spacing={3} style={{ padding: 20 }}>
				<Grid item xs={12} sm={4}>
					<TextField
						type="date"
						id="dateStart"
						name="dateStart"
						label="Data Inicio"
						fullWidth
						variant="standard"
						value={dateStart}
						onChange={(e) => setDateStart(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<TextField
						type="date"
						id="dateEnd"
						name="dateEnd"
						label="Data Fim"
						fullWidth
						variant="standard"
						value={dateEnd}
						onChange={(e) => setDateEnd(e.target.value)}
					/>
				</Grid>

				<Grid item xs={12} sm={4} justifyContent="center" alignItems="center">
					<Button
						onClick={find}
						label="Pesquisar"
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
								<TableCell style={{ width: '12%' }}>Nome Livro</TableCell>
								<TableCell style={{ width: '12%' }}>Autor</TableCell>
								<TableCell style={{ width: '12%' }}>Medium</TableCell>
								<TableCell style={{ width: '12%' }}>Editora</TableCell>
								<TableCell style={{ width: '12%' }}>Tipo Transação</TableCell>
								<TableCell style={{ width: '12%' }}>Data</TableCell>
								<TableCell style={{ width: '12%' }}>Usuario</TableCell>
								<TableCell style={{ width: '12%' }}>Preço Unitario</TableCell>
								<TableCell style={{ width: '12%' }}>Quantidade</TableCell>
								<TableCell style={{ width: '12%' }}>Preço Total</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{transactions
								//.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow hover key={row.id}>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.author}</TableCell>
											<TableCell>{row.medium}</TableCell>
											<TableCell>{row.publishCompany}</TableCell>
											<TableCell>{row.type}</TableCell>
											<TableCell>{row.date.toLocaleDateString()}</TableCell>
											<TableCell>{row.user}</TableCell>
											<TableCell>
												{Intl.NumberFormat('pt-BR', {
													style: 'currency',
													currency: 'BRL',
												}).format(row.price)}
											</TableCell>
											<TableCell>{row.quantity}</TableCell>
											<TableCell>
												{Intl.NumberFormat('pt-BR', {
													style: 'currency',
													currency: 'BRL',
												}).format(row.quantity * row.price)}
											</TableCell>
											<TableCell>
												<Button
													label="excluir"
													onClick={() => setTransactionToDelete(row)}
													loading={loading}
													fullWidth
												/>
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

export default TransactionList;
