"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* External modules */
const express_1 = require("express");
/* Locale modules */
const user_1 = require("../../controllers/user");
const router = express_1.Router();
router.post('/signin', user_1.userSignIn);
router.post('/signup', user_1.userSignUp);
exports.default = router;
