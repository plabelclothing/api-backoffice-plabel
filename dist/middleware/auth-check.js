"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const checkAuth = (req, res, next) => {
    const { path } = req;
    if (req.method === 'OPTIONS'
        || path.includes('/v1/check/ping')
        || path.includes('/v1/check/telemetry'))
        return next();
    const auth = req.headers.authorization;
    const token = ``;
    if (!auth || auth !== token) {
        return res.status(401).send({
            status: "FAIL" /* FAIL */,
            message: !auth ? 'Authorization header not found!' : 'Authorization token is not correct!',
            data: {
                errorCode: "GEN_000_ERROR" /* GEN_000_ERR */,
                errorId: 10000000 /* GEN_000_ERR */
            }
        });
    }
    next();
};
exports.checkAuth = checkAuth;
