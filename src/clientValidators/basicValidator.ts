import {hashsums} from "../index";
import {getFieldByHashObj} from "./getFieldByHashObj";
import _ from "lodash";

const allowedRPS = []
const allowedMods = []

const mapMods = (mods) => {
  return mods.map(e => e.hash)
}

export const basicValidator = (clientId, object): boolean => {
  if (!hashsums.hasOwnProperty(clientId)) return false

  console.log(clientId, object)

  const checkmap: any = hashsums[clientId]
  const pass: Array<boolean> = []
  // const fields: Array<string> = []
  try{
    for (let p in checkmap) {

      if (p !== 'mods' && p !== 'resourcepacks' && p !== 'shaderpacks') {

        if (object[p] === checkmap[p]) {
          pass.push(true)
          console.log('passing ', p)
        } else {
          pass.push(false)
        }
      } else {
        const iterableDirectory = checkmap[p];
        if(object.hasOwnProperty(p)){
          if (object[p].length >= iterableDirectory.length) {
            if(iterableDirectory.length > 0){
              iterableDirectory.forEach(v => {
                if (object[p].some(e => e.name === v.name && e.hash === v.hash)) {
                  pass.push(true)
                  console.log('passing ', p)
                } else {
                  pass.push(false)
                }
              })
            }
          }
        }else{
          pass.push(false)
        }
      }
    }
  }catch (e) {
    console.log(e)
    return false
  }

  const result = pass.every(v => v)
  console.log(result)
  return result

}
