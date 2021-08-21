/* External modules */
import {Router} from 'express';

/* Locale modules */
import {userSignIn, userSignUp} from "../../controllers/user";

const router = Router();

router.post('/signin', userSignIn);
router.post('/signup', userSignUp)

export default router;
