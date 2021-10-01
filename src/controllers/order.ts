/* External modules */
import {Request, Response} from 'express';
import {DateTime} from 'luxon';

/* Locale modules */
import {logger, loggerMessage, schemaValidator, ResponseThrowError} from '../utils';
import {LoggerLevel, StatusHttp, LogCodeId, LogCode, LuxonTimezone} from '../enums';
import {orderGetSchema, orderGetByUuidSchema} from '../models';
import {MySqlStorage} from '../services';

const orderGet = async (req: Request, res: Response) => {
    try {
        const {
            body,
        } = req;

        await schemaValidator(orderGetSchema, body);

        const date = DateTime.local().setZone(body.timezone);
        const dateFrom = body.dateFrom || date.minus({months: 3}).startOf('day').toFormat(LuxonTimezone.UNIX_TIMESTAMP_FORMAT);
        const dateTo = body.dateTo || date.toFormat(LuxonTimezone.UNIX_TIMESTAMP_FORMAT);

        const resultOfGetOrder = await MySqlStorage.getOrdersByCondition(dateFrom, dateTo, JSON.stringify(body.conditions));

        resultOfGetOrder.forEach(val => {
            val.user_order__created = DateTime.fromSeconds(<number>val.user_order__created).setZone(body.timezone).toFormat(LuxonTimezone.ISO_FORMAT);
            val.user_order__modified = DateTime.fromSeconds(<number>val.user_order__modified).setZone(body.timezone).toFormat(LuxonTimezone.ISO_FORMAT);
        });

        res.status(200).send({
            status: StatusHttp.SUCCESS,
            data: resultOfGetOrder,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json(error.responseObject);

        logger.log(LoggerLevel.ERROR, loggerMessage({
            error,
            additionalData: error.additionalData,
        }));
    }
};

const orderGetByUuid = async (req: Request, res: Response) => {
    try {
        const {
            body,
            params,
        } = req;

        await schemaValidator(orderGetByUuidSchema, body);

        const resultOfGetOrderByUuid = await MySqlStorage.getOrderByUuid(params.uuid);

        resultOfGetOrderByUuid.forEach(val => {
            val.user_order__address = JSON.parse(val.user_order__address);
            val.user_cart_items__amount = val.user_cart_items__amount * val.products__count;
        });

        if (!resultOfGetOrderByUuid.length) {
            throw new ResponseThrowError({
                statusCode: 404,
                message: `Order is not exist`,
                response: {
                    status: StatusHttp.FAIL,
                    message: `Order is not exist`,
                    data: {
                        errorCode: LogCode.DATA_NOT_FOUND,
                        errorId: LogCodeId.DATA_NOT_FOUND,
                    }
                }
            });
        }

        res.status(200).send({
            status: StatusHttp.SUCCESS,
            data: resultOfGetOrderByUuid,
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
    orderGet,
    orderGetByUuid,
}
