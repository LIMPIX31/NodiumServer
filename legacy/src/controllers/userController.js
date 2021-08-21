import {userService} from "../service/userService"
import {validateRegistrationData} from "../validators/registerValidator"
import {ApiError} from "../exceptions/ApiError"
import {ResultCode} from "../ResultCode"
import * as path from "path"
import {response} from "../response"

export const userController = {
  ping: async (req, res, next) => {
    res.json({ping: 'pong'})
  },
  registration: async (req, res, next) => {
    try {
      const {username, email, password, nickname, discord} = req.body

      if (!(await validateRegistrationData({username, email, password, nickname, discord}))) {
        return next(new ApiError.BadRequest('Ошибка при валидации', ResultCode.VALIDATION_ERROR))
      }

      const userData = await userService.registration(username, password, email, nickname, discord)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: process.env.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(response(ResultCode.OK, {userData}))
    } catch (e) {
      next(e)
    }
  },

  login: async (req, res, next) => {
    try {
      const {username, password} = req.body
      const userData = await userService.login(username, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: process.env.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(response(ResultCode.OK, userData))
    } catch (e) {
      next(e)
    }
  },
  logout: async (req, res, next) => {
    try {
      const {refreshToken} = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(response(ResultCode.OK, {token}))
    } catch (e) {
      next(e)
    }
  },
  activate: async (req, res, next) => {
    try {
      const link = req.params.link
      await userService.activate(link)
      res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  },
  refresh: async (req, res, next) => {
    try {
      const {refreshToken} = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: process.env.REFRESH_TOKEN_AGE_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(response(ResultCode.OK, userData))
    } catch (e) {
      next(e)
    }
  },

  me: async (req, res, next) => {
    try{
      const userData = req.user
      const fullUserData = await userService.me(userData.username)
      res.json(response(ResultCode.OK, fullUserData))
    }catch (e) {
      next(e)
    }
  },

  updateAvatar: async (req, res, next) => {
    try {
      const file = req.file
      console.log(req.file)
      if(file){
        await userService.updateAvatar(file)
      }else{
        throw ApiError.BadRequest(response(ResultCode.MISSING_FILE,{}))
      }
      res.json(response(ResultCode.OK),{
        avatarUrl: 'soon'
      })
    } catch (e) {
      next(e)
    }
  }
}
