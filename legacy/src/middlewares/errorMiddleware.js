import {ApiError} from "../exceptions/ApiError"
import {ResultCode} from "../ResultCode"

export const errorMiddleware = (err, req, res, next) => {
  console.log(err)
  if(err instanceof  ApiError){
    res.status(err.status).json({
      resultCode: err.code,
      message: err.message,
      errors: err.errors
    })
  }
  return res.status(500).json({
    resultCode: ResultCode.ERROR,
    message: 'Непредвиденная ошибка'
  })
}
