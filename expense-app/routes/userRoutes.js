import express from 'express';
import * as userController from '../controllers/userController';
import requireAuth from '../middlewares/requireAuth';

const router = express.Router();

router.use(requireAuth);
router.patch('/me', userController.user_update_meta);
router.patch('/me/pw', userController.user_update_password);
router.delete('/me', userController.user_delete);

export default router;
