import jwt from 'jsonwebtoken'
import {TokenModel} from "../../../src/models/token"

export const tokenService = {
  generateTokens: (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '10m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
    return {
      accessToken,
      refreshToken
    }
  },

  validateAccessToken(token){
    try{
      const userData = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
      return userData
    }catch (e){
      return null
    }
  },

  validateRefreshToken(token){
    try{
      const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
      return userData
    }catch (e){
      return null
    }
  },

  saveToken: async (userId, refreshToken) => {
    const tokenData = await TokenModel.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({user: userId, refreshToken})
    return token
  },

  removeToken: async (refreshToken) => {
    const tokenData = await TokenModel.deleteOne({refreshToken})
    return tokenData
  },

  findToken: async (refreshToken) => {
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }
}
