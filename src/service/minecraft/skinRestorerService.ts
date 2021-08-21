import {IUserDocument, UserModel} from "../../models/user";
import addd from 'add-dashes-to-uuid'
import {minecraftService} from "./minecraftService";

export const skinRestorerService = {
  async getProfileForSkinRestorer(type: 'username' | 'uuid',id: string): Promise<any | undefined> {
    let user:IUserDocument |  null = null
    if(type === 'username'){
      user = await UserModel.findOne({'gameProfile.nickname':id})
    }else{
      user = await UserModel.findOne({'gameProfile.uuid':id})
    }
    if(user !== null){
      const profile = await minecraftService.getProfile(user.gameProfile.uuid, false)
      if(profile !== null){
        const srprofile = {
          uuid: addd(user.gameProfile.uuid),
          username: user.gameProfile.nickname,
          textures:{
            raw:{
              ...profile.properties[0]
            }
          }
        }

        return srprofile

      }
    }
  }
}
