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
      "193.106.98.208"
    ],
    signaturePublickey:`-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA11KNb0LqhgUy17EnGRRT
BHSRc7/DRYt6QfNdLI9EdG04lPqt2jIhL5uW4r7zMw7lzaQdtcUetJ7TOY4MVjcG
OUmwc+kkmE5rTON8GCiKxphO+2n9v62P0IHAzYeWTWg7/5Ju6jb64SG31fL58Tn9
dk0vy8qYAUizE63CLUno8UekqqhdwKZ1bEKpI+8zMZ/dA0Z27tSDDGzZx991lHW7
7z5FrEZNvqJ+I+bvCRT6jA6HLYJ/EZN5fPrXTIufOP7HYlqCa8eVPaHYBsXEkJzB
0fo20YkOtskEpDRvey3aVqwoeFNSQAkPYQsnoZoLJCbG01kxck31AazTg2Wp55/C
gWT4Mhl7a5NOMUSnn/eMLlAd0bOl39PTH7rt2eMnFhU251kbd68e4tU6yQIKnpon
R+DyCBDyQ6F1ccl7ywQixIQrVP9cdfG6V8UgvGdblYdClckc48W3xijvCNoWwBc2
q5hsv+PrXeDk8bEIMcrnO7Tv93z5tnZmsN+4Wvd+fO42a4CR5hT3KNQwpnQBnIrb
GJhoSe/pWYmQV04sBpNYpgDkPftX1GeuFZcpJlnCpw7rKHNLqJ/jmuLxcq/Jo0UB
jz20Loeej+HcFfAEDHeLDr3F1bp11Wh8VKl3NVSg8bP7Mdp9K4pOoilTnNDkBels
DH0ar2IaNyoWAbi2n8NdC+cCAwEAAQ==
-----END PUBLIC KEY-----
`
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
