import {UserRole} from "../utils/userPermissions";

export type UserDTOType = {
  username: string,
  discord: string,
  avatar: string,
  balance: number,
  email: {
    email: string,
    emailVerified: boolean
  },
  createdTime: string,
  roles: Array<UserRole>,
  gameProfile: {
    nickname: string
    uuid: string
    nicknameChangeTime: number
    skin: string
    cape: string
  }
}


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
