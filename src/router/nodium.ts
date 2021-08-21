import {Router} from "express";
import {clientController} from "../controllers/clientController";

export const nodiumRouter = Router();


nodiumRouter.get('/nodiumInfo', clientController.nodiumInfo)
nodiumRouter.get('/getClientInfo', clientController.getInfo)
nodiumRouter.post('/validateClient', clientController.validateClient)
// nodiumRouter.get('/launcherVersion', clientController.launcherVersion)
