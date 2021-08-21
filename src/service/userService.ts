import {IUserDocument, UserModel, UserType} from "../models/user"
import {v4, v4 as UUIDv4} from 'uuid'
import bcrypt from "bcrypt"
import {mailService} from './mailService'
import {tokenService} from "./tokenService"
import {AuthDTO} from "../dtos/authDTO"
import {ApiError} from "../exceptions/ApiError"
import {ResultCode} from "../ResultCode"
import {response} from "../response"
import {UserDTO} from "../dtos/userDTO"
import path from "path";
import * as fs from "fs";
import {UserRole} from "../utils/userPermissions";

export const userService = {

  me: async (username) => {
    const userData = await UserModel.findOne({username})
    if (!userData) {
      throw ApiError.BadRequest(response(ResultCode.USER_NOT_EXISTS, {}))
    }
    return UserDTO(userData)
  },

  updatePngImage: async (type: 'avatar' | 'skin' | 'cape', id: string, file: any) => {
    const dirpath = `../../static/${id}/`
    await fs.promises.mkdir(path.join('static', id), {recursive: true})
    await file.mv(path.join(__dirname, dirpath, `${type}.png`));

    const user: IUserDocument | null = await UserModel.findById(id)
    if (user != null) {
      switch (type) {
        case "avatar": {
          user.avatar = true
        }
          break
        case "skin": {
          user.gameProfile.skin = true
        }
          break
        case "cape": {
          user.gameProfile.cape = true
        }
      }
      await user.save()
    }


    return `${process.env.API_URL}static/${id}/${type}.png`
  },

  resetTextures: async(username, type: 'skin' | 'cape' | 'avatar') => {
    const user: IUserDocument |  null = await UserModel.findOne({username})
    if(user !== null){
      switch (type){
        case "avatar":user.avatar = false
          break
        case "skin":user.gameProfile.skin = false
          break
        case "cape":user.gameProfile.cape = false
      }
      await user.save()
      return true
    }else{
      return false
    }
  }

}
