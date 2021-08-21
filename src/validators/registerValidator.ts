import * as yup from "yup"

const schema = yup.object().shape({
  username: yup.string().required()
    .min(4)
    .max(24)
    .matches(/^[A-Za-z0-9_]+$/u),
  password: yup.string().required()
    .min(8)
    .max(64),
  email: yup.string().required().email()
    .max(64),
  discord: yup.string()
    .matches(/^\w+?#\d\d\d\d$/),
  nickname: yup.string().required()
    .min(4)
    .max(24)
    .matches(/^[A-Za-z0-9_]+$/u),
})

export const validateRegistrationData = async (data): Promise<boolean> => {
  return schema.isValid(data)
}
