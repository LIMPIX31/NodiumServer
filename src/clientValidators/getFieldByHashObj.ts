export const getFieldByHashObj = (object, fieldName: string): null | any => {
  let result = null
  object.forEach(v => {
    if (v.name === fieldName) {
      result = {
        ...v
      }
    }
  })
  return result
}
