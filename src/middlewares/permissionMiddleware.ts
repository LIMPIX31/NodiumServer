import {Permission, UserRolesType, UserUtils} from "../utils/userPermissions";
import {ApiError} from "../exceptions/ApiError";
import {UserModel} from "../models/user";

export const permissionMiddleware = (permissoinList: Array<Permission>) => async (req, res, next) => {
  try {
    if (req.user === null) {
      return next(ApiError.NotPermitted())
    }
    const user = await UserModel.findOne({_id: req.user.id})
    if (user === null) {
      return next(ApiError.NotPermitted())
    }

    if (UserUtils.hasPermissionList(user, permissoinList)) {
      next()
    } else {
      return next(ApiError.NotPermitted())
    }


  } catch (e) {
    console.log(e)
    return next(ApiError.NotPermitted())
  }
}
