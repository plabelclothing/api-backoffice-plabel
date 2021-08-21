const config = module.exports = {};

config.application = 'api-backoffice-plabel';
config.applicationKey = '1e112ccd-3702-4a27-8d1d-9eef6ed04adf';

config.expressApi = {
	bind:               '',
	port:               null,
};

config.luxon = {
	timezone: 'Europe/Warsaw'
};

config.winston = {
	console:     {
		level:            'info',
		handleExceptions: true,
		json:             false,
		colorize:         false,
	},
	file:        {
		level:            'warn',
		handleExceptions: true,
		filename:         'logs/app.log',
		json:             true,
		maxsize:          5242880, // 5MB
		maxFiles:         100,
		colorize:         false
	},
	sentry:      {
		level: 'error',
		dsn:   ''
	},
	transports:  {
		file:    {
			enabled: false
		},
		console: {
			enabled: true
		},
		sentry:  {
			enabled: false
		}
	},
	exitOnError: false
};

config.mysqlRead = {
	id:              'READ',
	connection:      {
		connectionLimit: 1,
		host:            '',
		timezone:        'Europe/Warsaw',
		port:            null,
		database:        '',
		user:            '',
		password:        '',
		charset:         'UTF8_GENERAL_CI',
	},
	reconnectPeriod: 5000
};

config.mysqlWrite = {
	id:              'WRITE',
	connection:      {
		connectionLimit: 1,
		host:            '',
		timezone:        'Europe/Warsaw',
		port:            null,
		database:        '',
		user:            '',
		password:        '',
		charset:         'UTF8_GENERAL_CI'
	},
	reconnectPeriod: 5000
};

config.credential = {
	secretKey: '',
	iv:        '',
	ivKey:     ''
};

module.exports = config;
