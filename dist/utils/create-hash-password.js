"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Locale modules **/
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../bin/config"));
const createHashPasswordUtil = (password) => {
    const hashHmac = (stringToHash) => crypto_1.default.createHmac('sha512', config_1.default.credential.secretKey)
        .update(stringToHash)
        .digest('hex');
    const cipher = crypto_1.default.createCipheriv('aes-128-cbc', Buffer.from(config_1.default.credential.ivKey, 'base64'), Buffer.from(config_1.default.credential.iv, 'base64'));
    const cipherUpdate = cipher.update(password);
    const hashCipher = Buffer.concat([cipherUpdate, cipher.final()]).toString('hex');
    return hashHmac(hashCipher);
};
exports.createHashPasswordUtil = createHashPasswordUtil;
