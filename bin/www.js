#!/usr/bin/env node

import { createServer } from 'http';
import app from '../server/index.js';
// import Logger from '../utils/logger';

// const logger = new Logger();
const server = createServer(app);

// port function
function normalizePort(val) {
	const port = parseInt(val, 10);

	if (Number.isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}

// finalizing port
const port = normalizePort(process.env.DEV_APP_PORT || '3000');
app.set('port', port);

// for server errors
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? `Pipe ${port}`
		: `Port ${port}`;

	switch (error.code) {
	case 'EACCES':
		console.log(`${bind} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		console.log(`${bind} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
}

// listening function
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? `pipe ${addr}`
		: `port ${addr.port}`;

	console.log(`the server started listining on ${bind}`, 'info');
}


// starting server
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);