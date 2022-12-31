import { db } from '../config/firebase';
import { BookType } from '../models/bookType';
import {
	doc,
	setDoc,
	collection,
	query,
	getDocs,
	where,
	deleteDoc,
	getDoc,
} from 'firebase/firestore';

import { v4 as uuid } from 'uuid';

const COLLECTION_NAME = 'books';

const getBookBD = async (id: string) => {
	const newBook = { id: uuid(), stock: 0 };

	if (id === '') return newBook;

	const docRef = doc(db, COLLECTION_NAME, id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return newBook;
	}
};

const buildFieldFilter = (book: BookType): string[] => {
	const filter: string[] = [];
	book.name
		.toLocaleLowerCase()
		.split(' ')
		.forEach((value) => filter.push(value));
	book.author
		.toLocaleLowerCase()
		.split(' ')
		.forEach((value) => filter.push(value));
	book.publishCompany
		.toLocaleLowerCase()
		.split(' ')
		.forEach((value) => filter.push(value));
	book.medium
		.toLocaleLowerCase()
		.split(' ')
		.forEach((value) => filter.push(value));
	return filter;
};

const saveBook = async (book: BookType): Promise<boolean> => {
	try {
		const bookBD = await getBookBD(book.id);

		await setDoc(doc(db, COLLECTION_NAME, bookBD.id), {
			...bookBD,
			filter: buildFieldFilter(book),
			name: book.name,
			author: book.author,
			medium: book.medium,
			publishCompany: book.publishCompany,
			price: book.price,
		});
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

const updateStock = async (
	id: string,
	valueChange: number
): Promise<boolean> => {
	try {
		const book = await getBookBD(id);
		console.log(book);
		await setDoc(doc(db, COLLECTION_NAME, id), {
			...book,
			stock: book.stock + valueChange,
		});
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

const findBooks = async (filter: string): Promise<BookType[]> => {
	const queryBuilder = query(
		collection(db, COLLECTION_NAME),
		where('filter', 'array-contains-any', filter.toLocaleLowerCase().split(' '))
	);

	const documentSnapshots = await getDocs(queryBuilder);

	return documentSnapshots.docs.map<BookType>((doc) => ({
		id: doc.id,
		name: doc.data()['name'],
		author: doc.data()['author'],
		publishCompany: doc.data()['publishCompany'],
		medium: doc.data()['medium'],
		price: doc.data()['price'],
		stock: doc.data()['stock'],
	}));
};

const deleteBook = async (id: string): Promise<boolean> => {
	try {
		await deleteDoc(doc(db, COLLECTION_NAME, id));
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export { saveBook, findBooks, deleteBook, updateStock };
