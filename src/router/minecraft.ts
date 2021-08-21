import {Router} from "express";
import {clientController} from "../controllers/clientController";
import {minecraftSessionController} from "../controllers/minecraft/minecraftSessionController";
import {authMiddleware} from "../middlewares/authMiddleware";
import {userController} from "../controllers/userController";
import {minecraftController} from "../controllers/minecraft/minecraftController";
import {skinRestorerRouter} from "./skinRestorer";

export const minecraftRouter = Router();

// minecraftRouter.po
minecraftRouter.get('/', (req, res, next) => {
  res.json({
    meta: {},
    skinDomains: [
      "localhost",
    ],
    signaturePublickey:`-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYnBI60iS1NBCcIHGzksqScTwI\nkSX+p3axYRAE3BhB7J31XdudtcA4BhF2D/y0agaDinoailEqdgqoIdGVuVVqIyQm\n7FHBwQiPzhlSPbVGJki4f6j/QzcNX0WRLAARRFPZ3Ohbv6BVtuBto7BJtfjP8fTh\nKWc3KtY4faxmWbSCEwIDAQAB\n-----END PUBLIC KEY-----\n`
  })
})

minecraftRouter.get('/profile/:type/:id', minecraftController.reducedMinecraftProfile)
minecraftRouter.post('/modCheckAccess', minecraftSessionController.modCheckAccess)
minecraftRouter.post('/createAccess',authMiddleware,minecraftSessionController.createAccess)
minecraftRouter.post('/removeAccess',authMiddleware,minecraftSessionController.removeAccess)
minecraftRouter.get('/textures/:id/:type',minecraftSessionController.textures)
minecraftRouter.post('/sessionserver/session/minecraft/join', minecraftSessionController.join)
minecraftRouter.get('/sessionserver/session/minecraft/hasJoined', minecraftSessionController.hasJoined)
minecraftRouter.get('/sessionserver/session/minecraft/profile/:uuid', minecraftController.profile)

/**
 * Skin Restorer API
 */

minecraftRouter.use('/skinrestorer', skinRestorerRouter)
