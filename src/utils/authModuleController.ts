import {validateRegistrationData} from "../validators/registerValidator";
import {ApiError} from "../exceptions/ApiError";
import {response} from "../response";
import {ResultCode} from "../ResultCode";
import {userService} from "../service/userService";
import {UserModel} from "../models/user";
import bcrypt from "bcrypt";
import {v4 as UUIDv4} from "uuid";
import {UserRole} from "./userPermissions";
import {mailService} from "../service/mailService";
import {AuthDTO} from "../dtos/authDTO";
import {tokenService} from "../service/tokenService";

export const authModuleController = {
  registration: async (req, res, next) => {
    try {
      const {username, email, password, nickname, discord} = req.body

      if (!(await validateRegistrationData({username, email, password, nickname, discord}))) {
        return next(ApiError.BadRequest(response(ResultCode.VALIDATION_ERROR, null)))
      }

      const userData = await authModuleService.registration(username, password, email, nickname, discord)
      const maxAge: number = +(process.env.REFRESH_TOKEN_AGE_DAYS || '');
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: maxAge * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(response(ResultCode.OK, userData))
    } catch (e) {
      next(e)
    }
  },

  login: async (req, res, next) => {
    try {
      const {username, password} = req.body
      const userData = await authModuleService.login(username, password)
      const maxAge: number = +(process.env.REFRESH_TOKEN_AGE_DAYS || '');
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: maxAge * 24 * 60 * 60 * 1000,
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
      const token = await authModuleService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(response(ResultCode.OK, token))
    } catch (e) {
      next(e)
    }
  },
  activate: async (req, res, next) => {
    try {
      const link = req.params.link
      await authModuleService.activate(link)
      res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  },
  refresh: async (req, res, next) => {
    try {
      const {refreshToken} = req.cookies
      const userData = await authModuleService.refresh(refreshToken)
      const maxAge: number = +(process.env.REFRESH_TOKEN_AGE_DAYS || '');
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: maxAge * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(response(ResultCode.OK, userData))
    } catch (e) {
      next(e)
    }
  },
}

export const authModuleService = {
  registration: async (username, password, email, nickname, discord) => {
    const candidate = await UserModel.findOne({$or: [{username}, {email}, {'gameProfile.nickname': nickname}]})
    if (candidate) {
      throw ApiError.BadRequest(response(ResultCode.USER_ALREADY_EXISTS, null))
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationCode = UUIDv4();
    const createdTime = Date.now()
    const user = await UserModel.create({
      username,
      password: hashPassword,
      discord,
      avatar: '',
      email: {
        email,
        verificationCode: activationCode,
        emailVerified: false,
      },
      createdTime,
      lastAuthorizedTime: createdTime,
      roles: [UserRole.default],
      gameProfile: {
        nickname,
        uuid: UUIDv4(),
        nicknameChangeTime: createdTime
      }
    })
    await mailService.sendActivationMail(email, `${process.env.API_URL}api/activate/${activationCode}`)
    const userDTO = AuthDTO(user)
    const tokens = tokenService.generateTokens(JSON.parse(JSON.stringify(userDTO)))
    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDTO
    }
  },

  activate: async (link) => {
    const user = await UserModel.findOne({'email.verificationCode': link})
    if (!user) {
      throw ApiError.BadRequest(response(ResultCode.INCORRECT_ACTIVATION_LINK, null))
    }
    user.email.emailVerified = true
    await user.save()
  },

  login: async (username, password) => {
    const user = await UserModel.findOne({username})
    if (!user) {
      throw ApiError.BadRequest(response(ResultCode.WRONG_LOGIN_DATA, null))
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest(response(ResultCode.WRONG_LOGIN_DATA, null))
    }
    if (!user.email.emailVerified) {
      throw ApiError.BadRequest(response(ResultCode.EMAIL_NOT_VERIFIED, null))
    }
    const userDTO = AuthDTO(user)
    const tokens = tokenService.generateTokens(JSON.parse(JSON.stringify(userDTO)))
    await tokenService.saveToken(userDTO.id, tokens.refreshToken)


    return {
      ...tokens,
      user: userDTO
    }
  },
  logout: async (refreshToken) => {
    const token = await tokenService.removeToken(refreshToken)
    return token
  },

  refresh: async (refreshToken) => {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const authDTO = AuthDTO(user)
    const tokens = tokenService.generateTokens(JSON.parse(JSON.stringify(authDTO)))
    await tokenService.saveToken(authDTO.id, tokens.refreshToken, refreshToken)

    return {
      ...tokens,
      user: authDTO
    }
  },
}
