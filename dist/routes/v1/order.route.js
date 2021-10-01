"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External modules */
const express_1 = require("express");
/* Locale modules */
const order_1 = require("../../controllers/order");
const router = express_1.Router();
router.post('/', order_1.orderGet);
router.post('/:uuid', order_1.orderGetByUuid);
exports.default = router;
