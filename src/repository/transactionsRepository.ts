import { auth, db } from '../config/firebase';
import { BookType } from '../models/bookType';
import {
	doc,
	setDoc,
	collection,
	query,
	getDocs,
	where,
	deleteDoc,
} from 'firebase/firestore';

import { v4 as uuid } from 'uuid';
import { TransactionType } from '../models/transactionsType';

const COLLECTION_NAME = 'transactions';
const SELL = 'Venda';
const BUY = 'Compra';

const findTransactions = async (
	dateStart: Date,
	dateEnd: Date
): Promise<TransactionType[]> => {
	const queryBuilder = query(
		collection(db, COLLECTION_NAME),
		where('date', '>=', dateStart),
		where('date', '<=', dateEnd)
	);

	const documentSnapshots = await getDocs(queryBuilder);

	return documentSnapshots.docs.map<TransactionType>((doc) => ({
		id: doc.id,
		idBook: doc.data()['idBook'],
		name: doc.data()['name'],
		author: doc.data()['author'],
		publishCompany: doc.data()['publishCompany'],
		medium: doc.data()['medium'],
		price: doc.data()['price'],
		quantity: doc.data()['quantity'],
		type: doc.data()['type'],
		date: doc.data()['date'].toDate(),
		user: doc.data()['user'],
	}));
};

const saveTransactions = async (
	book: BookType,
	type: string,
	price: number,
	quantity: number
): Promise<boolean> => {
	try {
		await setDoc(doc(db, COLLECTION_NAME, uuid()), {
			idBook: book.id,
			name: book.name,
			author: book.author,
			medium: book.medium,
			publishCompany: book.publishCompany,
			price: price,
			quantity: quantity,
			date: new Date(),
			type,
			user: auth.currentUser?.email,
		});
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

const deleteTransaction = async (id: string): Promise<boolean> => {
	try {
		await deleteDoc(doc(db, COLLECTION_NAME, id));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
export { findTransactions, saveTransactions, BUY, SELL, deleteTransaction };
