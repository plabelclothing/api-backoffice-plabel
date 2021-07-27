'use strict';
/* External modules */
import {Router} from 'express';
/* Locale modules */
import check from './check.route';

const router = Router();

router.use('/check', check);

export default router;
