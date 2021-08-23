import jwt from 'jsonwebtoken'
import {ITokenDocument, TokenModel} from "../models/token"
import {AuthDTOType} from "../dtos/authDTO";

export const tokenService = {
  generateTokens: (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || '', {expiresIn: '10m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '', {expiresIn: '7d'})
    return {
      accessToken,
      refreshToken
    }
  },

  validateAccessToken(token):AuthDTOType | null{
    try{
      const userData: AuthDTOType = jwt.verify(token,process.env.JWT_ACCESS_SECRET || '') as AuthDTOType
      return userData
    }catch (e){
      return null
    }
  },

  validateRefreshToken(token){
    try{
      const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET || '')
      return userData
    }catch (e){
      return null
    }
  },

  async saveToken (userId, refreshToken, oldRefresh = null) {
    // const tokenData = await TokenModel.findOne({user: userId})
    // if (tokenData) {
    //   tokenData.refreshToken = refreshToken
    //   return tokenData.save()
    // }
    // const token = await TokenModel.create({user: userId, refreshToken})
    // return token
    const tokensData: Array<ITokenDocument> = await TokenModel.find({user: userId})
    let vsave
    tokensData.forEach(v => {
      if(this.validateRefreshToken(v.refreshToken) === null){
        this.removeToken(v.refreshToken)
        vsave = 0
      }
      if(v.refreshToken === oldRefresh){
        v.refreshToken = refreshToken
        vsave = v.save()
      }
    })

    if(vsave)return vsave

    const token = await TokenModel.create({user: userId, refreshToken})
    return token

  },

  removeToken: async (refreshToken) => {
    const tokenData = await TokenModel.deleteOne({refreshToken})
    return tokenData
  },

  async findToken(refreshToken){
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }
}
