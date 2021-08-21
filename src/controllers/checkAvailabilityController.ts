import {checkAvailabilityService, CheckAvailabilityType} from "../service/checkAvailabilityService";
import {response} from "../response";
import {ResultCode} from "../ResultCode";

export const checkAvailabilityController = {
  async checkAvailability(req, res, next){
    try{
      const body = req.body
      const type: CheckAvailabilityType = body.type
      const dataForCheck: string = body.dataForCheck
      const result = await checkAvailabilityService.checkAvailability(type, dataForCheck)
      if(type === 'username' || type === 'nickname'){
        res.json(response(ResultCode.OK, {
          available: result
        }))
      }else{
        res.json(response(ResultCode.WRONG_CHECKAVAILABILITY_TYPE, {
          available: result
        }))
      }
    }catch (e){
      next(e)
    }
  }
}
