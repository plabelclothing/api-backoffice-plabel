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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../bin/config"));
/* Locale modules */
const utils_1 = require("../utils");
const models_1 = require("../models");
const services_1 = require("../services");
const userSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, } = req;
        yield utils_1.schemaValidator(models_1.userSignInSchema, body);
        const hashPassword = utils_1.createHashPasswordUtil(body.password);
        const resultOfGetUserSignIn = yield services_1.MySqlStorage.getUserSignIn(body.email, hashPassword);
        if (!resultOfGetUserSignIn.length) {
            throw new utils_1.ResponseThrowError({
                statusCode: 404,
                message: `User is not exist`,
                response: {
                    status: "FAIL" /* FAIL */,
                    message: 'User is not exist',
                    data: {
                        errorCode: "DATA_NOT_FOUND" /* DATA_NOT_FOUND */,
                        errorId: 10000011 /* DATA_NOT_FOUND */,
                    }
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({
            data: {
                uuid: resultOfGetUserSignIn[0].user_backoffice__uuid,
            }
        }, config_1.default.credential.secretKey, { expiresIn: '1d' });
        res.status(200).send({
            status: "SUCCESS" /* SUCCESS */,
            data: {
                userEmail: resultOfGetUserSignIn[0].user_backoffice__email,
                token,
            },
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);
        utils_1.logger.log("error" /* ERROR */, utils_1.loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
});
exports.userSignIn = userSignIn;
const userSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, } = req;
        yield utils_1.schemaValidator(models_1.userSignInSchema, body);
        const resultOfCheckExistUser = yield services_1.MySqlStorage.checkExistUser(body.email);
        if (resultOfCheckExistUser.length) {
            throw new utils_1.ResponseThrowError({
                statusCode: 409,
                message: `User already exist`,
                response: {
                    status: "FAIL" /* FAIL */,
                    message: `User already exist`,
                    data: {
                        errorCode: "DUPLICATE" /* DUPLICATE */,
                        errorId: 10000012 /* DUPLICATE */,
                    }
                }
            });
        }
        const hashPassword = utils_1.createHashPasswordUtil(body.password);
        yield services_1.MySqlStorage.insertUser(body.email, hashPassword);
        res.status(201).send({
            status: "SUCCESS" /* SUCCESS */,
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);
        utils_1.logger.log("error" /* ERROR */, utils_1.loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
});
exports.userSignUp = userSignUp;
