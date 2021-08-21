"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../bin/config"));
const utils_1 = require("../utils");
const checkAuth = (req, res, next) => {
    const { path } = req;
    if (req.method === 'OPTIONS'
        || path.includes('/v1/check/ping')
        || path.includes('/v1/check/telemetry')
        || path.includes('/v1/user/signin')
        || path.includes('/v1/user/signup'))
        return next();
    try {
        const token = req.headers.token;
        let decoded = {};
        if (!token) {
            throw new utils_1.ResponseThrowError({
                statusCode: 401,
                message: 'Token header not found!',
                response: {
                    status: "FAIL" /* FAIL */,
                    message: 'Token header not found!',
                    data: {
                        errorCode: "GEN_000_ERROR" /* GEN_000_ERR */,
                        errorId: 10000000 /* GEN_000_ERR */
                    }
                }
            });
        }
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.credential.secretKey);
        }
        catch (err) {
            throw new utils_1.ResponseThrowError({
                statusCode: 401,
                message: 'Token header is not correct!',
                response: {
                    status: "FAIL" /* FAIL */,
                    message: 'Token header is not correct!',
                    data: {
                        errorCode: "GEN_000_ERROR" /* GEN_000_ERR */,
                        errorId: 10000000 /* GEN_000_ERR */
                    }
                }
            });
        }
        req.api.userUuid = decoded.data.uuid;
        next();
    }
    catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);
        utils_1.logger.log("error" /* ERROR */, utils_1.loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};
exports.checkAuth = checkAuth;
