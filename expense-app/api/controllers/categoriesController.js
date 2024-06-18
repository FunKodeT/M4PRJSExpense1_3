import prisma from '../constats/config.js';
import {DateTime} from 'luxon';

// CATEGORIES: RETRIEVE ALL CATEGORIES
const categories_get = async (req, res) => {
	console.log('getCategories started');
	let ctgs;
	console.log(ctgs);
	try {
		console.log('findCategories started');
		ctgs = await prisma.transactionCategory.findMany();
		console.log(ctgs, 'findCategories success');
		if (ctgs) {
			res.status(200).json({cfgs});
			console.log('getCategories success');
		}
		// if (ctgs) res.status(200).json({ cfgs })
	} catch {
		res.status(400).json({msg: 'Something has gone wrong'});
	}
};

// CATEGORIES: CREATE NEW CATEGORY
const categories_post = async (req, res) => {
	const {name} = req.body;
	if (!name) {
		return res.status(400).json({msg: 'Please provide a Name'});
	}
	// if (!name) return res.status(400).json({msg: 'Please provide a Name'})
	try {
		const ctgs = await prisma.transactionCategory.create({
			data: {
				name: name,
				userId: req.session.userId,
			},
		});
		res.status(201).json(ctgs);
	} catch (e) {
		// console.log(e)
		// IF ERROR IS PRISMA-UNIQUE CONSTRAINT ERROR:
		if (e.code === 'P2002') {
			res.status(400).json({msg: 'This category already exists'});
		} else {
			res.status(400).json({msg: 'Something has gone wrong'});
		}
	}
};

// CATEGORIES: DELETE CATEGORY
const categories_delete = async (req, res) => {
	const {categoryId} = req.params;
	console.log(req.params);
	if (!categoryId) {
		return res.status(400).json({msg: 'Please provide a Name'});
	}
	// if (!categoryId)
	// 	return res.status(400).json({msg: 'Please provide a Name'});
	try {
		await prisma.transactionCategory.deleteMany({
			where: {
				id: categoryId,
				userId: req.session.userId,
			},
		});
		res.status(200).json({
			msg: `Deleted category with ID of ${categoryId}`,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({msg: 'Something has gone wrong'});
	}
};

// CATEGORIES: SUMMARIZE TRANSACTIONS
const categories_transaction_sum = async (req, res) => {
	let firstDate = req.query.first;
	let lastDate = DateTime.now().toISO();

	if (!firstDate) {
		firstDate = DateTime.now().minus({month: 1}).toISO();
	}

	try {
		const transactions = await prisma.transaction.groupBy({
			by: ['transactionCategoryId'],
			_sum: {
				money: true,
			},
			where: {
				userId: req.session.userId,
				date: {
					gte: firstDate,
					lt: lastDate,
				},
			},
		});

		const categories = await prisma.transactionCategory.findMany({
			where: {
				userId: req.session.userId,
			},
		});

		const categoriesWithSum = categories.map((category) => {
			const transaction = transactions.find(
				(transaction) =>
					transaction.transactionCategoryId === category.id
			);
			return {
				...category,
				sum: transaction ? transaction._sum.money : 0,
			};
		});
		res.status(200).json(categoriesWithSum);
	} catch (e) {
		console.log(e);
		res.status(400).json({msg: 'Something has gone wrong'});
	}
};

export {
	categories_get,
	categories_transaction_sum,
	categories_post,
	categories_delete,
};
