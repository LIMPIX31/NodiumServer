import {UserModel, UserRole} from "../../../src/models/user"
import {v4 as UUIDv4} from 'uuid'
import bcrypt from "bcrypt"
import {mailService} from './mailService'
import {tokenService} from "./tokenService"
import {AuthDTO} from "../dtos/authDTO"
import {ApiError} from "../exceptions/ApiError"
import {ResultCode} from "../ResultCode"
import {response} from "../response"
import {UserDTO} from "../dtos/userDTO"
export const userService = {
  registration: async (username, password, email, nickname, discord) => {
    const candidate = await UserModel.findOne({$or: [{username}, {email}]})
    if (candidate) {
      throw new ApiError.BadRequest(response(ResultCode.USER_ALREADY_EXISTS,{}))
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
      throw new ApiError.BadRequest(response(ResultCode.INCORRECT_ACTIVATION_LINK,{}))
    }
    user.email.emailVerified = true
    await user.save()
  },

  login: async (username, password) => {
    const user = await UserModel.findOne({username})
    if (!user) {
      throw ApiError.BadRequest(response(ResultCode.WRONG_LOGIN_DATA,{}))
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest(response(ResultCode.WRONG_LOGIN_DATA,{}))
    }
    if(!user.email.emailVerified){
      throw ApiError.BadRequest(response(ResultCode.EMAIL_NOT_VERIFIED,{}))
    }
    const userDTO = new AuthDTO(user)
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
    if(!refreshToken){
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const userDTO = new AuthDTO(user)
    const tokens = tokenService.generateTokens(JSON.parse(JSON.stringify(userDTO)))
    await tokenService.saveToken(userDTO.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDTO
    }
  },

  me:async(username) => {
    const userData = await UserModel.findOne({username})
    if(!userData){
      throw ApiError.BadRequest(response(ResultCode.USER_NOT_EXISTS,{}))
    }
    return UserDTO(userData)
  },

  updateAvatar: async(file) => {
    await file.mv(path.join(__dirname, 'avatar'))
  }

}
