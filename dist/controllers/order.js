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
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
/* Locale modules */
const utils_1 = require("../utils");
const enums_1 = require("../enums");
const models_1 = require("../models");
const services_1 = require("../services");
const orderGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, } = req;
        yield utils_1.schemaValidator(models_1.orderGetSchema, body);
        const date = luxon_1.DateTime.local().setZone(body.timezone);
        const dateFrom = body.dateFrom || date.minus({ months: 3 }).startOf('day').toFormat(enums_1.LuxonTimezone.UNIX_TIMESTAMP_FORMAT);
        const dateTo = body.dateTo || date.toFormat(enums_1.LuxonTimezone.UNIX_TIMESTAMP_FORMAT);
        const resultOfGetOrder = yield services_1.MySqlStorage.getOrdersByCondition(dateFrom, dateTo, JSON.stringify(body.conditions));
        resultOfGetOrder.forEach(val => {
            val.user_order__created = luxon_1.DateTime.fromSeconds(val.user_order__created).setZone(body.timezone).toFormat(enums_1.LuxonTimezone.ISO_FORMAT);
            val.user_order__modified = luxon_1.DateTime.fromSeconds(val.user_order__modified).setZone(body.timezone).toFormat(enums_1.LuxonTimezone.ISO_FORMAT);
        });
        res.status(200).send({
            status: "SUCCESS" /* SUCCESS */,
            data: resultOfGetOrder,
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
exports.orderGet = orderGet;
const orderGetByUuid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, params, } = req;
        yield utils_1.schemaValidator(models_1.orderGetByUuidSchema, body);
        const resultOfGetOrderByUuid = yield services_1.MySqlStorage.getOrderByUuid(params.uuid);
        resultOfGetOrderByUuid.forEach(val => {
            val.user_order__address = JSON.parse(val.user_order__address);
            val.user_cart_items__amount = val.user_cart_items__amount * val.products__count;
        });
        if (!resultOfGetOrderByUuid.length) {
            throw new utils_1.ResponseThrowError({
                statusCode: 404,
                message: `Order is not exist`,
                response: {
                    status: "FAIL" /* FAIL */,
                    message: `Order is not exist`,
                    data: {
                        errorCode: "DATA_NOT_FOUND" /* DATA_NOT_FOUND */,
                        errorId: 10000011 /* DATA_NOT_FOUND */,
                    }
                }
            });
        }
        res.status(200).send({
            status: "SUCCESS" /* SUCCESS */,
            data: resultOfGetOrderByUuid,
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
exports.orderGetByUuid = orderGetByUuid;
