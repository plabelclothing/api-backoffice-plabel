/* eslint-disable init-declarations */
/**
 * @module storage/mysql
 */
import debSql from 'debug';
import mysql from 'mysql';

/* Local modules */
import config from '../bin/config';
import {logger, loggerMessage, ResponseThrowError} from '../utils';
import {LoggerLevel, LogCode, StatusHttp, LogCodeId} from '../enums';
import {DbQuery} from '../types/db-query';
/* Variables */
const debug = debSql('mysql');
let mysqlPool: mysql.PoolCluster | null;

/**
 * Creates instance of MySQL prototype.
 */
const MySqlStorage = (isError?: boolean) => {
    if (mysqlPool && !isError) {
        return;
    }

    if (config && config.mysqlRead && config.mysqlWrite
        && config.mysqlRead.connection && config.mysqlRead.connection) {
        mysqlPool = mysql.createPoolCluster();
        mysqlPool.add(config.mysqlRead.id, config.mysqlRead.connection);
        mysqlPool.add(config.mysqlWrite.id, config.mysqlWrite.connection);

        // @ts-ignore - only for dev mode
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const mysqlPoolNode in mysqlPool._node) {
            // noinspection JSUnfilteredForInLoop
            // @ts-ignore - only for dev mode
            const pool = mysqlPool._nodes[mysqlPoolNode].pool;
            pool.on('enqueue', () => {
                debug('Waiting for available connection slot.');
            });
            pool.on('acquire', (connection: { threadId: any; }) => {
                debug(`Connection %d acquired. ${connection.threadId}`);
            });
            pool.on('connection', () => {
                debug('A new connection has been made with pool.');
            });
            pool.on('release', (connection: { threadId: any; }) => {
                debug(`Connection %d released. ${connection.threadId}`);
            });
        }
    } else {
        logger.log(LoggerLevel.ERROR, loggerMessage({
            message: 'Config has no mysql property defined. Check configuration file.',
            error: new Error('Config has no mysql property defined. Check configuration file.')
        }));
    }
};

MySqlStorage.connect = async <T>(isError: boolean, callback: (arg: boolean) => T) => {
    MySqlStorage(isError);
    mysqlPool!.getConnection((error, connection) => {
        if (error) {
            if (connection) {
                connection.release();
            }
            return callback(false);
        }
        connection.release();
        return callback(true);
    });
};

/**
 * Check available pool
 * @returns {Promise<boolean>}
 */
MySqlStorage.checkPool = () => {
    return Promise.all([
        new Promise(async (resolve, reject) => {
            await mysqlPool!.getConnection(config.mysqlRead.id, (error, connection) => {
                if (error) {
                    if (connection) {
                        connection.release();
                    }
                    return reject(error);
                }
                if (connection) {
                    connection.release();
                }
                return resolve(true);
            });
        }),
        new Promise(async (resolve, reject) => {
            await mysqlPool!.getConnection(config.mysqlWrite.id, (error, connection) => {
                if (error) {
                    if (connection) {
                        connection.release();
                    }
                    return reject(error);
                }
                if (connection) {
                    connection.release();
                }
                return resolve(true);
            });
        }),
    ]);
};

/**
 * Execute given query.
 */
const executeQuery = async <T>(query: string, params: any[], isWrite: boolean = false): Promise<T> => {
    try {
        await MySqlStorage.checkPool();
    } catch (e) {
        mysqlPool = null;
    }
    MySqlStorage();
    return new Promise((resolve, reject) => {
        if (mysqlPool === null) {
            let error = new Error('MySQL pool has a null value. Pool has not been created.');
            return reject(error);
        }
        const conType = isWrite ? config.mysqlWrite.id : config.mysqlRead.id;
        mysqlPool.getConnection(conType, (error, connection) => {
            if (error) {
                if (connection) {
                    connection.release();
                }
                return reject(error);
            }
            query = mysql.format(query, params);
            logger.log(LoggerLevel.DEBUG, loggerMessage({
                message: `Call procedure MySql: ${query}`,
            }));
            debug(query);
            connection.query(query, (queryError, rows) => {
                connection.release();
                if (queryError) {
                    return reject(queryError);
                }
                return resolve(rows);
            });
        });
    });
};

/** start region of procedures **/


/**
 * Test query
 *
 */
MySqlStorage.testQuery = () => executeQuery<[][]>('SELECT 1', [])
    .then((rows) => (Promise.resolve(rows[0])))
    .catch((e) => {
        const error = new ResponseThrowError({
            statusCode: 500,
            message: `Failed while executing testQuery function. \nCaused by:\n ${e.stack}`,
            response: {
                status: StatusHttp.FAIL,
                message: 'Internal server error',
                data: {
                    errorCode: LogCode.MYSQL_SERVICE__QUERY_ERR,
                    errorId: LogCodeId.MYSQL_SERVICE__QUERY_ERR,
                }
            }
        });
        return Promise.reject(error);
    });


/** end region of procedures **/

export {
    MySqlStorage
};
