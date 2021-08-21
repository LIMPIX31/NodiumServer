import * as mongoose from "mongoose";
import {Document, Model, Schema} from "mongoose";
import {UserType} from "./user";

export type TokenType = {
  user:{
    type: Schema.Types.ObjectId,
    ref: string
  },
  refreshToken: string
}

export const LoginTokenSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  refreshToken: String
})

export interface ITokenDocument extends TokenType, Document {}
export interface ITokenModel extends Model<ITokenDocument> {}

export const TokenModel: ITokenModel = mongoose.model<ITokenDocument>('RefreshToken', LoginTokenSchema);
