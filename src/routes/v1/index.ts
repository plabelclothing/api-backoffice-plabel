'use strict';
/* External modules */
import {Router} from 'express';
/* Locale modules */
import check from './check.route';
import user from './user.route';
import order from './order.route';

const router = Router();

router.use('/check', check);
router.use('/user', user);
router.use('/order', order);

export default router;
