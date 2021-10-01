/* External modules */
import {Router} from 'express';

/* Locale modules */
import {orderGet, orderGetByUuid} from '../../controllers/order';

const router = Router();

router.post('/', orderGet);
router.post('/:uuid', orderGetByUuid);

export default router;
