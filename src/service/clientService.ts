import _ from "lodash"
import {basicValidator} from "../clientValidators/basicValidator";

export const clientService = {
  async getInfo(): Promise<any> {
    return require('../../clients.json')
  },
  async validateClient(clientId:string, object) {
    return basicValidator(clientId,object)
  }
}
