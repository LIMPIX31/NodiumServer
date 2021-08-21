import {skinRestorerService} from "../../service/minecraft/skinRestorerService";
import {minecraftService} from "../../service/minecraft/minecraftService";

export const skinRestorerController = {
  async profile(req, res, next){
    try{
      let {type,id} = req.params
      if(id === 'xknat') id = 'LIMPIX31'

      res.json(await skinRestorerService.getProfileForSkinRestorer(type, id))

    }catch (e) {
      next(e)
    }
  },
  async textures(req, res, next) {
    try{
      let {uuid} = req.params
      const profile = await minecraftService.getProfile(uuid, false)
      if(profile !== null){
        res.json({
          raw:{
            ...Object.assign({},profile,{status:"OK"})
          }
        })
      }
    }catch (e) {
      next(e)
    }
  }
}
