import crypto from 'crypto-js'
import dotenv from 'dotenv'

dotenv.config()

export const encryptApIKey=async(apikey:string)=>{
try{
    const secret = process.env.cryptoKey

    if(secret === undefined) return 'secret key is required'

    const encrypt= crypto.AES.encrypt(apikey,secret)

    return encrypt.toString()
  }catch(error){
    
    return error
  }
}