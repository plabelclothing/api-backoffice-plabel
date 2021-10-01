/* External modules */
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import config from '../bin/config';

/* Locale modules */
import {logger, loggerMessage, schemaValidator, createHashPasswordUtil, ResponseThrowError} from '../utils';
import {LoggerLevel, StatusHttp, LogCodeId, LogCode} from '../enums';
import {userSignInSchema} from '../models';
import {MySqlStorage} from '../services';

const userSignIn = async (req: Request, res: Response) => {
    try {
        const {
            body,
        } = req;

        await schemaValidator(userSignInSchema, body);

        const hashPassword = createHashPasswordUtil(body.password);

        const resultOfGetUserSignIn = await MySqlStorage.getUserSignIn(body.email, hashPassword);

        if (!resultOfGetUserSignIn.length) {
            throw new ResponseThrowError({
                statusCode: 404,
                message: `User is not exist`,
                response: {
                    status: StatusHttp.FAIL,
                    message: 'User is not exist',
                    data: {
                        errorCode: LogCode.DATA_NOT_FOUND,
                        errorId: LogCodeId.DATA_NOT_FOUND,
                    }
                }
            });
        }

        const token = jwt.sign({
            data: {
                uuid: resultOfGetUserSignIn[0].user_backoffice__uuid,
            }
        }, config.credential.secretKey, {expiresIn: '1d'});

        res.status(200).send({
            status: StatusHttp.SUCCESS,
            data: {
                userEmail: resultOfGetUserSignIn[0].user_backoffice__email,
                token,
            },
        });

    } catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);

        logger.log(LoggerLevel.ERROR, loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};

const userSignUp = async (req: Request, res: Response) => {
    try {
        const {
            body,
        } = req;

        await schemaValidator(userSignInSchema, body);

        const resultOfCheckExistUser = await MySqlStorage.checkExistUser(body.email);

        if (resultOfCheckExistUser.length) {
            throw new ResponseThrowError({
                statusCode: 409,
                message: `User already exist`,
                response: {
                    status: StatusHttp.FAIL,
                    message: `User already exist`,
                    data: {
                        errorCode: LogCode.DUPLICATE,
                        errorId: LogCodeId.DUPLICATE,
                    }
                }
            });
        }

        const hashPassword = createHashPasswordUtil(body.password);

        await MySqlStorage.insertUser(body.email, hashPassword);

        res.status(201).send({
            status: StatusHttp.SUCCESS,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);

        logger.log(LoggerLevel.ERROR, loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};

const userGetData = async (req: Request, res: Response) => {
    try {
        const {
            api,
        } = req;

        const resultOfGetUserData = await MySqlStorage.getUserDataByUuid(<string>api.userUuid);

        if (!resultOfGetUserData.length) {
            throw new ResponseThrowError({
                statusCode: 404,
                message: `User data is not exist`,
                response: {
                    status: StatusHttp.FAIL,
                    message: `User already exist`,
                    data: {
                        errorCode: LogCode.DATA_NOT_FOUND,
                        errorId: LogCodeId.DATA_NOT_FOUND,
                    }
                }
            });
        }

        res.status(200).send({
            status: StatusHttp.SUCCESS,
            data: {
                userEmail: resultOfGetUserData[0].user_backoffice__email,
            }
        });

    } catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);

        logger.log(LoggerLevel.ERROR, loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};

export {
    userSignIn,
    userSignUp,
    userGetData,
}
