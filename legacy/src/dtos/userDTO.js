// import {IUserModel, UserRole, UserType} from "../../../src/models/user"

export const UserDTO = (model) => {
  const newObj = JSON.parse(JSON.stringify(model))
  return {
    username: newObj.username,
    discord: newObj.discord,
    avatar: newObj.avatar,
    balance: newObj.balance,
    email: {
      email: newObj.email,
      emailVerified: newObj.emailVerified
    },
    createdTime: newObj.createdTime,
    roles: newObj.roles,
    gameProfile: newObj.gameProfile
  }
}
