import {IUserDocument, UserModel} from "../../models/user";
import crypto from "crypto";
import {minecraftPrivateKey} from "../../index";

export const minecraftService = {
  async getProfile(uuid: string, unsigned: boolean) {
    const user = await UserModel.findOne({'gameProfile.uuid': uuid})
    if (user !== null) {
      const textures = await this.getTextures(user, unsigned)
      const base64Textures = btoa(JSON.stringify(textures))
      const profile = {
        id: user.gameProfile.uuid,
        name: user.gameProfile.nickname,
        properties: [
          {
            name: "textures",
            value: base64Textures,
          }
        ]
      }

      if(!unsigned){
        // const rawSignature = crypto.createSign('RSA-SHA256')
        // rawSignature.update(base64Textures)
        // const signature = rawSignature.sign(minecraftPrivateKey,'base64')
        const rawSignature = crypto.createSign('sha1WithRSAEncryption')
        rawSignature.update(base64Textures)
        const signature = rawSignature.sign(minecraftPrivateKey,'base64')
        profile.properties[0]['signature'] = signature
      }

      console.log(profile)

      return profile
    } else {
      return null
    }
  },

  reducedMinecraftProfile: async (type: 'username' | 'uuid', id): Promise<{name: string, id: string, status: string} |  null> => {
    console.log(id)
    let user:IUserDocument |  null = null
    if(type === 'username'){
      user = await UserModel.findOne({'gameProfile.nickname':id})
    }else{
      user = await UserModel.findOne({'gameProfile.uuid':id})
    }
    if (user !== null) {
      return {
        name: user.gameProfile.nickname,
        id: user.gameProfile.uuid,
        status: "OK"
      }
    }else {
      return null
    }
  },

  async getTextures(user, unsigned) {

    const skcl = {}

    if (user.gameProfile.skin) {
      Object.assign(skcl, {
        SKIN: {
          url: `${process.env.API_URL}minecraft/textures/${user.id}/skin?t=${Date.now()}`,
          // url: `${process.env.API_URL}static/${user.id}/skin.png?t=${Date.now()}`,
          metadata: {
            model: 'default'
          }
        }
      })
    }

    if (user.gameProfile.cape) {
      Object.assign(skcl, {
        CAPE: {
          url: `${process.env.API_URL}minecraft/textures/${user.id}/cape?t=${Date.now()}`,
          // url: `${process.env.API_URL}static/${user.id}/cape.png?t=${Date.now()}`,
          metadata: {}
        }
      })
    }

    const textures = {
      timestamp: Date.now(),
      profileId: user.gameProfile.uuid,
      profileName: user.gameProfile.nickname,
      textures: skcl
    }

    if (!unsigned){
      textures["signatureRequired"] = true
    }

    return textures
  },
}
