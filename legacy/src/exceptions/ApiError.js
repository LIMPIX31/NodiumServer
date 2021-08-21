import {ResultCode} from "../ResultCode"

export class ApiError extends Error {
  constructor(status,code,message,errors=[]) {
    super(message)
    this.status = status
    this.errors = errors
    this.code = code
  }

  static UnauthorizedError(){
    return new ApiError(401,ResultCode.UNAUTHORIZED,'Пользователь не авторизован')
  }

  static BadRequest(mscode, errors){
    return new ApiError(400,mscode.resultCode, mscode.message, errors)
  }

}
