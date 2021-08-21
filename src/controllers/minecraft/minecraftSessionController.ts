import {response} from "../../response";
import {ResultCode} from "../../ResultCode";
import {minecraftSessionService} from "../../service/minecraft/minecraftSessionService";
import {ApiError} from "../../exceptions/ApiError";
import path from "path";
import {minecraftService} from "../../service/minecraft/minecraftService";

const unAuthError = (res) => {
  res.json({
    error: "Unauthorized",
    errorMessage: "Unauthorized. Токен доступа не найден или его срок действия истёк",
    cause: "Возможно вы не вошли в аккаунт или вышли из него во время игры"
  }).sendStatus(401)
}


const AuthQueue = {}


export const minecraftSessionController = {

  async modCheckAccess(req, res,next){
    try{
      const {accessToken, uuid} = JSON.parse(req.headers['minecraft-client-data'])
      const isValid = await minecraftSessionService.checkAccess(accessToken, uuid.replaceAll('-',''))
      console.log(isValid)
      res.json(response(ResultCode.OK, {
        isValid
      }))
    }catch (e) {
      next(e)
    }
  },

  async createAccess(req, res, next) {
    try {
      const {username} = req.user
      const accessToken = await minecraftSessionService.createAccess(username)
      if(accessToken !== null){
        res.json(response(ResultCode.OK, {
          accessToken
        }))
      }else{
        ApiError.BadRequest(response(ResultCode.USER_NOT_EXISTS, null))
      }
    } catch (e) {
      next(e)
    }
  },

  async removeAccess(req,res,next){
    try{
      const {username} = req.user
      await minecraftSessionService.removeAccess(username)
      response(ResultCode.OK, null)
    }catch (e) {
      next(e)
    }
  },

  async textures(req, res, next){
    try{
      const {id, type} = req.params
      switch (type){
        case 'skin':{
          res.sendFile(path.join(__dirname,'../../../static',id,'skin.png'))
        }
        break
        case 'cape':{
          res.sendFile(path.join(__dirname,'../../../static',id,'cape.png'))
        }
      }
    }catch (e) {
      next(e)
    }
  },

  async join(req, res, next) {
    try {

      const {accessToken, selectedProfile, serverId} = req.body
      const access = await minecraftSessionService.checkAccess(accessToken, selectedProfile)
      AuthQueue[selectedProfile] = access
      if (access) {
        const result = await minecraftSessionService.addServer(selectedProfile, serverId)
        if (!result) {
          res.json({
            error: "UserNotFound",
            errorMessage: "UserNotFound. Игрок не найден",
            cause: ""
          }).sendStatus(404)
          return
        }
        res.sendStatus(204)
      } else {
        unAuthError(res)
      }
    } catch (e) {
      next(e)
    }
  },
  async hasJoined(req, res, next) {
    try {
      const {username, serverId} = req.query
      const user = await minecraftSessionService.getConnectingUser(username, serverId)
      if (user !== null) {
        const textures = await minecraftService.getTextures(user, false)
        const profile = await minecraftService.getProfile(user.gameProfile.uuid, false)
        // res.json({
        //   id: user.gameProfile.uuid,
        //   name: username,
        //   properties: [
        //     {
        //       name: "textures",
        //       value: btoa(JSON.stringify(textures))
        //     }
        //   ]
        // })
        res.json(profile)
      } else {
        unAuthError(res)
      }
    } catch (e) {
      next(e)
    }
  },
}
