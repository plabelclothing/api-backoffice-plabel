/* External modules */
import {Router} from 'express';

/* Locale modules */
import {userSignIn, userSignUp, userGetData} from '../../controllers/user';

const router = Router();

router.post('/signin', userSignIn);
router.post('/signup', userSignUp);
router.get('/data', userGetData);

export default router;
