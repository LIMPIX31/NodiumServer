import {ApiError} from "../exceptions/ApiError"
import {tokenService} from "../service/tokenService"
import {AuthDTOType} from "../dtos/authDTO";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if(!authHeader){
      return next(ApiError.UnauthorizedError())
    }
    const accessToken = authHeader.split(' ')[1]
    if(!accessToken){
      return next(ApiError.UnauthorizedError())
    }
    const userData: AuthDTOType | null = tokenService.validateAccessToken(accessToken)
    if(userData == null){
      return next(ApiError.UnauthorizedError())
    }

    req.user = userData
    next()

  }catch (e){
    return next(ApiError.UnauthorizedError())
  }
}
