import prisma from '../constats/config';
import bcrypt from 'bcrypt';

// USER: UPDATE USER METADATA
const user_update_meta = async (req, res) => {
	const {firstName, lastName} = req.body;
	try {
		await prisma.user.update({
			where: {
				id: req.session.userId,
			},
		});
		res.status(200).send('Update: Successful');
	} catch (e) {
		// THIS MAY NEED TO BE REFORMATTED TO `ERROR ${UPDATE_META}`
		res.status(500).send('Error {Update Meta}');
	}
};

// USER: UPDATE PASSWORD
const user_update_password = async (req, res) => {
	const {password, oldPassword} = req.body;
	let user;

	// BACKEND: FIND USER
	try {
		user = await prisma.user.findUnique({
			where: {
				id: req.session.userId,
			},
		});
	} catch {
		res.status(500).json({msg: 'Something has gone wrong'});
		return;
	}

	// BACKEND: USER FOUND
	if (user) {
		const isPassCorrect = await bcrypt.compare(oldPassword, user.password);
		// BACKEND: PASSWORD CORRECT
		if (isPassCorrect) {
			// HASH AND SALT A NEW PASSWORD
			const saltRounds = 10;
			let newPassword = await bcrypt.hash(password, saltRounds);
			try {
				await prisma.user.update({
					where: {
						id: req.session.userId,
					},
				});
			} catch {
				res.status(500).send('Cannot update password');
			}
		} else {
			// BACKEND: PASSWORD INCORRECT
			res.status(403).send('Incorrect password');
		}
	}
};

// USER: DELETE USER
const user_delete = async (req, res) => {
	const userId = req.session.userId;
	req.session.destroy((err) => {
		if (err) res.status(500).send('Cannot destroy the session');
		else res.status(200).send('Session destroyed');
	});
	await prisma.user.delete({
		where: {
			id: userId,
		},
	});
};

export {user_update_meta, user_update_password, user_delete};
