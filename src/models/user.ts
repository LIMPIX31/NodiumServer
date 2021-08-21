import {Document, Model, Schema} from "mongoose";
import mongoose from "mongoose";
import {Permission, UserRole, UserRolesType} from "../utils/userPermissions";


export type UserType = {
  username: string
  password: string
  discord: string
  avatar: boolean
  balance: number
  email: {
    email: string
    verificationCode: string
    emailVerified: boolean
  },
  createdTime: number,
  roles: Array<UserRole>
  gameProfile: {
    nickname: string
    uuid: string
    accessToken: string,
    serverId: string
    nicknameChangeTime: number
    skin: boolean
    cape: boolean
  }
}

export const UserSchema: Schema = new Schema({
  username: String,
  password: String,
  discord: String,
  avatar: Boolean,
  balance: Number,
  email: {
    email: String,
    verificationCode: String,
    emailVerified: {
      type: Boolean,
      default: false
    }
  },
  createdTime: Number,
  roles: {
    type: [String],
    default: [UserRole.default]
  },
  gameProfile: {
    nickname: String,
    uuid: String,
    accessToken: {
      type: String,
      default: ''
    },
    serverId: {
      type: String,
      default: ''
    },
    nicknameChangeTime: Number,
    skin: {
      type: Boolean,
      default: false
    },
    cape: {
      type: Boolean,
      default: false
    },
  }
})

export interface IUserDocument extends UserType, Document {}

export interface IUserModel extends Model<IUserDocument> {}

export const UserModel: IUserModel = mongoose.model<IUserDocument>('User', UserSchema);
