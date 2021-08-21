import {NextFunction, Request, Response} from 'express';
import {StatusHttp, LogCode, LogCodeId, LoggerLevel} from '../enums';
import {Utils} from '../types/utils';
import jwt from 'jsonwebtoken';
import config from '../bin/config';
import {logger, loggerMessage, ResponseThrowError} from "../utils";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {

    const {path} = req;

    if (
        req.method === 'OPTIONS'
        || path.includes('/v1/check/ping')
        || path.includes('/v1/check/telemetry')
        || path.includes('/v1/user/signin')
        || path.includes('/v1/user/signup')
    ) return next();


    try {
        const token = req.headers.token as string;
        let decoded = <Utils.JwtUserToken>{};

        if (!token) {
            throw new ResponseThrowError({
                statusCode: 401,
                message: 'Token header not found!',
                response: {
                    status: StatusHttp.FAIL,
                    message: 'Token header not found!',
                    data: {
                        errorCode: LogCode.GEN_000_ERR,
                        errorId: LogCodeId.GEN_000_ERR
                    }
                }
            });
        }

        try {
            decoded = <Utils.JwtUserToken>jwt.verify(token, config.credential.secretKey);
        } catch (err) {
            throw new ResponseThrowError({
                statusCode: 401,
                message: 'Token header is not correct!',
                response: {
                    status: StatusHttp.FAIL,
                    message: 'Token header is not correct!',
                    data: {
                        errorCode: LogCode.GEN_000_ERR,
                        errorId: LogCodeId.GEN_000_ERR
                    }
                }
            });
        }

        req.api.userUuid = decoded.data.uuid;

        next();
    } catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);

        logger.log(LoggerLevel.ERROR, loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};

export {
    checkAuth
};
