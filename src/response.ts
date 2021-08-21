import {ResultCode} from "./ResultCode"

export const response = (code: ResultCode, data: any) => {
  let message
  switch (code) {
    case ResultCode.OK: {
      message = 'ok'
    }
      break
    case ResultCode.ERROR: {
      message = 'Неизвестная ошибка'
    }
      break
    case ResultCode.WRONG_LOGIN_DATA: {
      message = 'Неверный логин или пароль'
    }
      break
    case ResultCode.EMAIL_NOT_VERIFIED: {
      message = 'Email не верифицирован'
    }
      break
    case ResultCode.INCORRECT_ACTIVATION_LINK: {
      message = 'Некорректная ссылка активации'
    }
      break
    case ResultCode.UNAUTHORIZED: {
      message = 'Пользователь не авторизован'
    }
      break
    case ResultCode.USER_ALREADY_EXISTS: {
      message = 'Этот пользователь уже существует'
    }
      break
    case ResultCode.VALIDATION_ERROR: {
      message = 'Ошибка валидации'
    }
      break
    case ResultCode.MISSING_FILE: {
      message = 'Отсутствует файл'
    }
      break
    case ResultCode.WRONG_CHECKAVAILABILITY_TYPE: {
      message = 'Неверный тип проверки доступности имени'
    }
      break
    case ResultCode.MISSING_BODY_FIELDS: {
      message = 'Отсутсвуют ожидаемые поля в запросе'
    }
      break
    case ResultCode.USER_NOT_EXISTS: {
      message = 'Такого пользователя не существует'
    }
      break
    case ResultCode.INVALID_FIELD_TYPE: {
      message = 'Ожидаемый тип поля запроса не соответсвует полученному'
    }
      break
    case ResultCode.NOT_ENOUGH_PERMISSIONS: {
      message = 'Недостаточно прав'
    }
      break
    default: {
      message = 'Неизвестный код'
    }
  }

  return {
    resultCode: code,
    message,
    data: {...data}
  }

}
