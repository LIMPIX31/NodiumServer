import {ResultCode} from "../ResultCode"
import {response} from "../response";

export class ApiError extends Error {

  status: number
  errors: any
  code: ResultCode

  constructor(status, code, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
    this.code = code
  }

  static UnauthorizedError() {
    return new ApiError(401, ResultCode.UNAUTHORIZED, 'Пользователь не авторизован')
  }

  static BadRequest(mscode, errors = []) {
    return new ApiError(400, mscode.resultCode, mscode.message, errors)
  }

  static NotPermitted() {
    const r = response(ResultCode.NOT_ENOUGH_PERMISSIONS, null)
    return new ApiError(405, r.resultCode, r.message)
  }

}
