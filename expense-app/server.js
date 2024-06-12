// BACKEND: REQUIRED FUNCTIONALITY
import express from 'express';
import expressSession from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';

// BACKEND: REQUIRED ROUTE DATA
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';
import categoriesRoutes from './routes/categoriesRoutes';

// BACKEND: PRISMA CLIENT
import prisma from './constats/config';

const app = express();
const port = process.env.SERVER_PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BACKEND SERVER-CLIENT DIRECTORY / REACT BUILD
app.use(express.static(path.join(__dirname, 'clientBuild')));

// BACKEND: CORS CLIENT
// https://www.funkodet.com/expenses_server/
app.use(
	cors({
		origin: ['http://localhost:3000', 'https://localhost:5001'],
		methods: ['POST', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'],
		credentials: true,
	})
);

// USER: COOKIE / SESSION DATA
app.use(
	expressSession({
		cookie: {
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, //ms
		},
		secret: 'a santa at nasa',
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);

// BACKEND: REQUIRED MODULES
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// BACKEND: ROUTE PATHS
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);
app.use('/api', categoriesRoutes);

// BACKEND: SEND FRONTEND USER INTERFACE
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'clientBuild', 'index.html'));
});

// BACKEND: SERVER LAUNCH
app.listen(port, () => {
	console.log(`Server has been started on: ${port}`);
});
