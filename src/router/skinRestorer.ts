import {Router} from "express";
import {skinRestorerController} from "../controllers/minecraft/skinRestorerController";

export const skinRestorerRouter = Router();

skinRestorerRouter.get('/profile/:type/:id',skinRestorerController.profile)
skinRestorerRouter.get('/textures/:uuid',skinRestorerController.textures)
