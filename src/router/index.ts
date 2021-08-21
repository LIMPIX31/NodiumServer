import {Router} from "express";
import {userController} from "../controllers/userController"
import {authMiddleware} from "../middlewares/authMiddleware"
import {permissionMiddleware} from "../middlewares/permissionMiddleware";
import {Permission, URP} from "../utils/userPermissions";

export const router = Router();

router.get('/ping', userController.ping)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/me', authMiddleware, userController.me)
router.post('/updateAvatar', authMiddleware, userController.updateTexture('avatar'))
router.post('/updateSkin', authMiddleware, permissionMiddleware([Permission.SKIN]), userController.updateTexture('skin'))
router.post('/updateCape', authMiddleware, permissionMiddleware([Permission.CAPE]), userController.updateTexture('cape'))
/**
 * Сброс текстуры
 * @post(\api/resetTexture/[тип_текстуры<skin | cape>])
 * @response(<APIResponse[OK, null]>)
 */
router.post('/resetTexture/:type', authMiddleware, userController.resetTexture)
// router.post('/resetTexture/:tt', authMiddleware, userController.resetTexture)
// router.post('/checkAvailability', checkAvailabilityController.checkAvailability)
