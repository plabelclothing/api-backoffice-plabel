/// <reference path="../types/express.d.ts" />
import {Request, Response, NextFunction} from 'express';
import {v4} from 'uuid';

const secureHeaders = (req: Request, res: Response, next: NextFunction) => {
	req.api = {
		requestId: v4()
	};

	res.header('X-Frame-Options', 'SAMEORIGIN; SAMEORIGIN');
	res.header('X-Xss-Protection', '1; mode=block');
	res.header('X-Content-Type-Options', 'nosniff');
	res.header('X-Request-Id', req.api.requestId);
	res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	// Cross origin support for browsers
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Token, Accept');

	// Close connection
	res.set('Connection', 'close');
	next();
};

export {
	secureHeaders
};
