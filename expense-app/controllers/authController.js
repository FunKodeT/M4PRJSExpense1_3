import prisma from '../constats/config.js';
import bcrypt from 'bcrypt';
import {z} from 'zod';

// USER LOGIN AUTHORIZATION FUNCTION
const auth_login = async (req, res) => {
	let user;
	const {email, password} = req.body;
	if (!email || !password) {
		res.status(400).json({message: 'Fields Missing'});
		return;
	}
	try {
		user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		// CHECK PASSWORD
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (isPasswordCorrect) {
			// ADD USERID TO SESSION
			req.session.userId = user.id;
			res.status(200).send('Authorized');
		} else {
			res.status(400).json({message: 'Invalid credentials'});
		}
	} catch (e) {
		if (!user) {
			res.status(400).json({message: 'Invalid credentials'});
		} else {
			res.status(400).json({message: 'Something has gone wrong'});
		}
		//     if (!user) res.status(400).json({message: 'Invalid credentials'})
		// else res.status(400).json({message: 'Something has gone wrong'})
	}
};

// USER REGISTRATION FUNCTION
const auth_register = async (req, res) => {
	const {email, password, firstName, lastName} = req.body;
	const schema = z.object({
		email: z.string().email({message: 'Invalid email address'}),
		password: z.string().min(3, {
			message: 'Password must be atleast 3 characters in length',
		}),
		firstName: z.string().min(2, {
			message: 'First name must be at least 2 characters in length',
		}),
		lastName: z.string().min(2, {
			message: 'Last name must be at least 2 characters in length',
		}),
	});
	const isValid = schema.safeParse(req.body);
	if (isValid?.error) {
		res.status(400).json({errors: isValid?.error?.errors});
		return;
	}
	let emailCheck;
	try {
		emailCheck = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
	} catch {
		res.status(500).json({message: 'Something has gone wrong with email'});
	}
	if (emailCheck) {
		res.status(500).json({message: 'Email already exists'});
	} else {
		// if(emailCheck) res.status(500).json({message: 'Email already exists'})
		//     else {
		const saltRounds = 10;
		let salted_password = await bcrypt.hash(password, saltRounds);
		let newUser;

		try {
			newUser = await prisma.user.create({
				data: {
					email: email,
					password: salted_password,
					firstName: firstName,
					lastName: lastName,
				},
			});
			await prisma.transactionCategory.createMany({
				data: [
					{
						name: 'Products',
						userId: newUser.id,
					},
					{
						name: 'Entertainment',
						userId: newUser.id,
					},
					{
						name: 'Bills',
						userId: newUser.id,
					},
				],
			});
			res.status(200).json({userId: newUser.id});
		} catch (e) {
			console.log(e);
			res.status(500).json({
				message: 'Something has gone wrong with registration',
			});
			return;
		}
	}
};

// USER LOGOUT FUNCTION
const auth_logout = async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500).send('Cannot destroy the session');
		} else {
			res.status(200).send('Session destroyed');
		}
		// if (err) res.status(500).send('Cannot destroy the session');
		// else res.status(200).send('Session destroyed');
	});
};

// USER AUTHENTICATION FUNCTION
const auth_user = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.session.userId,
			},
		});
		if (!user) {
			res.status(401).json('User was not found');
		}
		// if (!user) res.status(401).json('User was not found');
		const data = {
			email: user.email,
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
		};
		res.status(200).json(data);
	} catch {
		res.status(500).json('Something has gone wrong during authentication');
	}
};

export {auth_register, auth_login, auth_logout, auth_user};

// ERROR
// SYNTAX ERROR: BEGIN
// SYNTAX ERROR: END
// ERROR
