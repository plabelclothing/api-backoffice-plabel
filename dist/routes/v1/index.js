'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* External modules */
const express_1 = require("express");
/* Locale modules */
const check_route_1 = __importDefault(require("./check.route"));
const user_route_1 = __importDefault(require("./user.route"));
const router = express_1.Router();
router.use('/check', check_route_1.default);
router.use('/user', user_route_1.default);
exports.default = router;
