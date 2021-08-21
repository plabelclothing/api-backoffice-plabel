"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable init-declarations */
/**
 * @module storage/mysql
 */
const debug_1 = __importDefault(require("debug"));
const mysql_1 = __importDefault(require("mysql"));
/* Local modules */
const config_1 = __importDefault(require("../bin/config"));
const utils_1 = require("../utils");
/* Variables */
const debug = debug_1.default('mysql');
let mysqlPool;
/**
 * Creates instance of MySQL prototype.
 */
const MySqlStorage = (isError) => {
    if (mysqlPool && !isError) {
        return;
    }
    if (config_1.default && config_1.default.mysqlRead && config_1.default.mysqlWrite
        && config_1.default.mysqlRead.connection && config_1.default.mysqlRead.connection) {
        mysqlPool = mysql_1.default.createPoolCluster();
        mysqlPool.add(config_1.default.mysqlRead.id, config_1.default.mysqlRead.connection);
        mysqlPool.add(config_1.default.mysqlWrite.id, config_1.default.mysqlWrite.connection);
        // @ts-ignore - only for dev mode
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const mysqlPoolNode in mysqlPool._node) {
            // noinspection JSUnfilteredForInLoop
            // @ts-ignore - only for dev mode
            const pool = mysqlPool._nodes[mysqlPoolNode].pool;
            pool.on('enqueue', () => {
                debug('Waiting for available connection slot.');
            });
            pool.on('acquire', (connection) => {
                debug(`Connection %d acquired. ${connection.threadId}`);
            });
            pool.on('connection', () => {
                debug('A new connection has been made with pool.');
            });
            pool.on('release', (connection) => {
                debug(`Connection %d released. ${connection.threadId}`);
            });
        }
    }
    else {
        utils_1.logger.log("error" /* ERROR */, utils_1.loggerMessage({
            message: 'Config has no mysql property defined. Check configuration file.',
            error: new Error('Config has no mysql property defined. Check configuration file.')
        }));
    }
};
exports.MySqlStorage = MySqlStorage;
MySqlStorage.connect = (isError, callback) => __awaiter(void 0, void 0, void 0, function* () {
    MySqlStorage(isError);
    mysqlPool.getConnection((error, connection) => {
        if (error) {
            if (connection) {
                connection.release();
            }
            return callback(false);
        }
        connection.release();
        return callback(true);
    });
});
/**
 * Check available pool
 * @returns {Promise<boolean>}
 */
MySqlStorage.checkPool = () => {
    return Promise.all([
        new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            yield mysqlPool.getConnection(config_1.default.mysqlRead.id, (error, connection) => {
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
        })),
        new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            yield mysqlPool.getConnection(config_1.default.mysqlWrite.id, (error, connection) => {
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
        })),
    ]);
};
/**
 * Execute given query.
 */
const executeQuery = (query, params, isWrite = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield MySqlStorage.checkPool();
    }
    catch (e) {
        mysqlPool = null;
    }
    MySqlStorage();
    return new Promise((resolve, reject) => {
        if (mysqlPool === null) {
            let error = new Error('MySQL pool has a null value. Pool has not been created.');
            return reject(error);
        }
        const conType = isWrite ? config_1.default.mysqlWrite.id : config_1.default.mysqlRead.id;
        mysqlPool.getConnection(conType, (error, connection) => {
            if (error) {
                if (connection) {
                    connection.release();
                }
                return reject(error);
            }
            query = mysql_1.default.format(query, params);
            utils_1.logger.log("debug" /* DEBUG */, utils_1.loggerMessage({
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
});
/** start region of procedures **/
/**
 * Test query
 *
 */
MySqlStorage.testQuery = () => executeQuery('SELECT 1', [])
    .then((rows) => (Promise.resolve(rows[0])))
    .catch((e) => {
    const error = new utils_1.ResponseThrowError({
        statusCode: 500,
        message: `Failed while executing testQuery function. \nCaused by:\n ${e.stack}`,
        response: {
            status: "FAIL" /* FAIL */,
            message: 'Internal server error',
            data: {
                errorCode: "MYSQL__ERROR" /* MYSQL_SERVICE__QUERY_ERR */,
                errorId: 10000006 /* MYSQL_SERVICE__QUERY_ERR */,
            }
        }
    });
    return Promise.reject(error);
});
/**
 * Check exist user
 * @param email
 */
MySqlStorage.checkExistUser = (email) => executeQuery('CALL app_backend_backoffice__user_backoffice__check_exist(?)', [
    email,
])
    .then((rows) => (Promise.resolve(rows[0])))
    .catch((e) => {
    const error = new utils_1.ResponseThrowError({
        statusCode: 500,
        message: `Failed while executing checkExistUser function. \nCaused by:\n ${e.stack}`,
        response: {
            status: "FAIL" /* FAIL */,
            message: 'Internal server error',
            data: {
                errorCode: "MYSQL__ERROR" /* MYSQL_SERVICE__QUERY_ERR */,
                errorId: 10000006 /* MYSQL_SERVICE__QUERY_ERR */,
            }
        }
    });
    return Promise.reject(error);
});
/**
 * Insert a new user
 * @param email
 * @param password
 */
MySqlStorage.insertUser = (email, password) => executeQuery('CALL app_backend_backoffice__user_backoffice__signup(?,?)', [
    email,
    password,
])
    .then((rows) => (Promise.resolve(rows[0])))
    .catch((e) => {
    const error = new utils_1.ResponseThrowError({
        statusCode: 500,
        message: `Failed while executing insertUser function. \nCaused by:\n ${e.stack}`,
        response: {
            status: "FAIL" /* FAIL */,
            message: 'Internal server error',
            data: {
                errorCode: "MYSQL__ERROR" /* MYSQL_SERVICE__QUERY_ERR */,
                errorId: 10000006 /* MYSQL_SERVICE__QUERY_ERR */,
            }
        }
    });
    return Promise.reject(error);
});
/**
 * SignIn user data
 * @param email
 * @param password
 */
MySqlStorage.getUserSignIn = (email, password) => executeQuery('CALL app_backend_backoffice__user__signin(?,?)', [
    email,
    password,
])
    .then((rows) => (Promise.resolve(rows[0])))
    .catch((e) => {
    const error = new utils_1.ResponseThrowError({
        statusCode: 500,
        message: `Failed while executing getUserSignIn function. \nCaused by:\n ${e.stack}`,
        response: {
            status: "FAIL" /* FAIL */,
            message: 'Internal server error',
            data: {
                errorCode: "MYSQL__ERROR" /* MYSQL_SERVICE__QUERY_ERR */,
                errorId: 10000006 /* MYSQL_SERVICE__QUERY_ERR */,
            }
        }
    });
    return Promise.reject(error);
});
