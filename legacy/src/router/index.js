import {Router} from "express";
import {userController} from "../controllers/userController"
import {authMiddleware} from "../middlewares/authMiddleware"

export const router = new Router();

router.get('/ping', userController.ping)
router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/me',authMiddleware,userController.me)
router.post('/updateAvatar',authMiddleware, userController.updateAvatar)
