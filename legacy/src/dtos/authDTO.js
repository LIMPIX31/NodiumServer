export const AuthDTO = (model) => {
  const newObj = JSON.parse(JSON.stringify(model))
  return {
    id: newObj._id,
    username: newObj.username,
    email: newObj.email.email
  }
}
