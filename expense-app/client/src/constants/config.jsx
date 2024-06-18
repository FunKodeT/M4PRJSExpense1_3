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
const AXIOS_URL = 'http://localhost.5001/api/';
export {AXIOS_URL, queryClient};
