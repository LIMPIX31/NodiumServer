import {UserModel} from "../../models/user";
import jwt from 'jsonwebtoken'
import addd from 'add-dashes-to-uuid'
import crypto from 'crypto'
import {minecraftPrivateKey} from "../../index";

export const minecraftSessionService = {

  async validateToken(token) {
    return !!jwt.verify(token, process.env.JWT_MINECRAFT_SECRET || '')
  },

  async checkAccess(accessToken: string, uuid: string) {
    const user = await UserModel.findOne({'gameProfile.accessToken': accessToken, 'gameProfile.uuid': uuid})
    if (user !== null) {
      return this.validateToken(user.gameProfile.accessToken)
    } else {
      return false
    }
  },
  async createAccess(username: string) {
    const user = await UserModel.findOne({username})
    if (user !== null) {
      const token = jwt.sign({
        username: user.gameProfile.nickname,
        uuid: user.gameProfile.uuid,
      }, process.env.JWT_MINECRAFT_SECRET || '', {expiresIn: '1d'})
      user.gameProfile.accessToken = token
      user.save()
      return token
    } else {
      return null
    }
  },
  async removeAccess(username: string) {
    const user = await UserModel.findOne({username})
    if (user !== null) {
      user.gameProfile.accessToken = ''
      user.save()
    }
  },
  async addServer(uuid: string, serverId: string) {
    const user = await UserModel.findOne({'gameProfile.uuid': uuid})
    if (user) {
      user.gameProfile.serverId = serverId
      user.save()
      return true
    } else {
      return false
    }
  },
  async getConnectingUser(username: string, serverId: string) {
    const user = await UserModel.findOne({'gameProfile.nickname': username, 'gameProfile.serverId': serverId})
    return user
  },

}
