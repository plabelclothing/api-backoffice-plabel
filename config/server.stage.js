/**
 * @module config/stage
 */
'use strict';

const config = module.exports = {};

config.expressApi = {
	bind:   '{{ api_backoffice_api_bind_address }}',
	port:   {{ api_backoffice_api_bind_port }},
};

config.winston = {
	file:   {
		filename:   '{{ api_backoffice_logfilename }}'
	},
	sentry: {
		dsn:    '{{ api_backoffice_sentry_dsn }}'
	}
};

config.mysqlRead = {
	connection:     {
		host:       '{{ api_backoffice_mysql_read_host }}',
		port:       {{ api_backoffice_mysql_read_port }},
		database:   '{{ api_backoffice_mysql_read_database }}',
		user:       '{{ api_backoffice_mysql_read_user }}',
		password:   '{{ api_backoffice_mysql_read_password }}'
    }
};

config.mysqlWrite = {
	connection: {
		host:       '{{ api_backoffice_mysql_write_host }}',
		port:       {{ api_backoffice_mysql_write_port }},
		database:   '{{ api_backoffice_mysql_write_database }}',
		user:       '{{ api_backoffice_mysql_write_user }}',
		password:   '{{ api_backoffice_mysql_write_password }}'
	}
};

