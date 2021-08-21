import _ from "lodash";
import {IUserDocument} from "../models/user";

export enum Permission {
  ALL = 'ALL',
  ACCESS_TO_MINECRAFT = 'ALLOW_ACCESS_TO_MINECRAFT',
  SKIN = 'SKIN',
  CAPE = 'CAPE',
}

export const URP = {
  default: [
    Permission.ACCESS_TO_MINECRAFT,
    Permission.SKIN,
  ],
  cape: [
    Permission.CAPE,
  ],
  admin: [
    Permission.ALL,
  ]
}

export enum UserRole {
  default = 'default',
  admin = 'admin',
  cape = 'cape'
}

export type UserRolesType = Array<Array<Permission>>


export const UserUtils = {
  /**
   * Преобразует массив ролей в массив разрешений
   */

  concatRoles(roles: UserRolesType): Array<Permission> {
    return _.union<Permission>(...roles)
  },

  /**
   * Проверяет наличие права у пользователя
   * @param user
   * @param permission
   */
  getUserPermission(user: IUserDocument, permission: Permission) {
    const permissions = this.concatRoles(this.RA2RPA(user.roles))
    return permission.includes(Permission.ALL) || permission.includes(permission)
  },

  /**
   * Проверяет наличие списка прав у пользователя на основе имеющихся у него ролей
   * @param user
   * @param permissions
   */
  hasPermissionList(user: IUserDocument, permissions: Array<Permission>): boolean {
    const userPermissions: Array<Permission> = this.concatRoles(this.RA2RPA(user.roles))
    const pass: Array<boolean> = []
    if (userPermissions.includes(Permission.ALL)) return true
    permissions.forEach(v => {
      pass.push(userPermissions.includes(v))
    })
    return pass.every(v => v)
  },
  /**
   *  Складывает разрешения указанных ролей и возвращает новую роль.
   */

  extend(...roles){
    return this.concatRoles([...roles])
  },
  /**
   * Преобразует массив идентификаторов ролей в массив ключей идентификаторов ролей содержащих массив разрешений
   * @param roles
   */
  RA2RPA(roles: Array<UserRole>): UserRolesType{
    return roles.map(v => URP[v])
  }

}
