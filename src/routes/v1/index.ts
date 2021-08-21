'use strict';
/* External modules */
import {Router} from 'express';
/* Locale modules */
import check from './check.route';
import user from './user.route';

const router = Router();

router.use('/check', check);
router.use('/user', user);

export default router;
