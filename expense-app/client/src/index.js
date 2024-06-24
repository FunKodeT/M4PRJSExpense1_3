// import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

// IF YOU ARE RUNNING THE INTERCEPT FILE IN COMPONENTS,
// YOU WILL NEED TO UNCOMMENT THE CODE BELOW AND COMMENT THE LINES 18-26
ReactDOM.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
// IF YOU ARE NOT RUNNING THE INTERCEPT FILE YOU CAN COMMENT IT OUT,
// IN THE APP.JS FILE AND USE THE CODE BELOW
/* const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
); */
