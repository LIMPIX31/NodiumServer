import {response} from "../response";
import {ResultCode} from "../ResultCode";
import {clientService} from "../service/clientService";
import {ApiError} from "../exceptions/ApiError";

export const clientController = {

  async nodiumInfo(req, res, next){
    try{
        res.json(response(ResultCode.OK, {launcherVersionCode: +(process.env.NODIUM_VERSION_CODE || '0')}))
    }catch (e) {
      next(e)
    }
  },

  async getInfo(req, res, next){
    try{
      const result = await clientService.getInfo()
      res.json(response(ResultCode.OK, result))
    }catch (e){
      next(e)
    }
  },

  async validateClient (req, res, next){
    try{
      const {object, clientId} = req.body
      if(object !== '' && clientId !== ''){
        const result = await clientService.validateClient(clientId,JSON.parse(object))
        res.json(response(ResultCode.OK, {
          valid: result
        }))
      }else{
        ApiError.BadRequest(response(ResultCode.INVALID_FIELD_TYPE, null))
      }
    }catch (e){
      next(e)
    }
  }

}
