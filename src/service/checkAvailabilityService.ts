import {UserModel} from "../models/user";

export type CheckAvailabilityType = 'username' | 'nickname'

export const checkAvailabilityService = {
  async checkAvailability(type: CheckAvailabilityType, dataForCheck: string): Promise<boolean> {
    switch (type) {
      case "username": {
        const user = await UserModel.findOne({username: dataForCheck})
        return user == null
      }
      case "nickname": {
        const user = await UserModel.findOne({'gameProfile.nickname': dataForCheck})
        return user == null
      }
    }
  }
}
