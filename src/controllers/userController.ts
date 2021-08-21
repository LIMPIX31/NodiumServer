import {userService} from "../service/userService"
import {validateRegistrationData} from "../validators/registerValidator"
import {ApiError} from "../exceptions/ApiError"
import {ResultCode} from "../ResultCode"
import {response} from "../response"
import {authModuleController} from "../utils/authModuleController";

export const userController = {
  ping: async (req, res, next) => {
    res.json({ping: 'pong'})
  },
  /**
   * Включаем поддержку авторизации
   */
  ...authModuleController,


  me: async (req, res, next) => {
    try {
      const userData = req.user
      const fullUserData = await userService.me(userData.username)
      res.json(response(ResultCode.OK, fullUserData))
    } catch (e) {
      next(e)
    }
  },


  updateTexture: (textureType: 'skin' | 'cape' | 'avatar') => async (req, res, next) => {
    try {
      const file = req.files.file
      if (file) {
        const url = await userService.updatePngImage(textureType, req.user.id, file)
        res.json(response(ResultCode.OK, {
          url
        }))
      } else {
        throw ApiError.BadRequest(response(ResultCode.MISSING_FILE, null))
      }
    } catch (e) {
      next(e)
    }
  },

  resetTexture: async (req, res, next) => {
    try{
      const {type} = req.params
      const result = await userService.resetTextures(req.user.username,type)
      if(result){
        res.json(response(ResultCode.OK, null))
      }else{
        res.json(response(ResultCode.ERROR, null))
      }
    }catch (e) {
      next(e)
    }
  }

}
