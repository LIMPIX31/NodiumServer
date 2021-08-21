import {userService} from "../../service/userService";
import {minecraftSessionService} from "../../service/minecraft/minecraftSessionService";
import {minecraftService} from "../../service/minecraft/minecraftService";

export const minecraftController = {
  async reducedMinecraftProfile(req, res, next) {
    try {
      let {type, id} = req.params
      if(id === 'xknat') id = 'LIMPIX31'
      const reducedProfile = await minecraftService.reducedMinecraftProfile(type, id)
      if (reducedProfile !== null) {
        return res.json(reducedProfile)
      }
    } catch (e) {
      next(e)
    }
  },
  async profile(req, res, next) {
    try {
      const {uuid} = req.params
      const {unsigned} = req.query
      console.log(req.query)
      const profile = await minecraftService.getProfile(uuid, unsigned === 'true')
      if (profile !== null) {
        res.json(profile)
      }
    } catch (e) {
      next(e)
    }
  }
}
