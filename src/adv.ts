export const validateIp = (ip: string):boolean => {
    if(ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/u)=== null)return false
    let ipBits:Array<string> = ip.split('.')
    if(ipBits.length !== 4) return false
    let checks = 0
    for (let ipBit in ipBits){
        if(+ipBit >= 0 && +ipBit <= 255) checks++
    }
    if(checks < 4) return false
    return true
}

type resultCodeObjectType = {
    readonly resultCode: number
}

export const ccb = (code:number):resultCodeObjectType => {
    return {
        resultCode: code
    }
}
