import {QueryClient} from 'react-query';
const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			retry: false,
		},
		queries: {
			retry: false,
		},
	},
});

// CHANGE API BELOW TO PERSONAL API
const AXIOS_URL = 'http://localhost:5001/api/';
// const AXIOS_URL = process.env.DATABASE_URL;
// 'postgresql://postgres:P0w3r0v3rwh3lm1ng!!@localhost:5432/express-app';
export {AXIOS_URL, queryClient};
