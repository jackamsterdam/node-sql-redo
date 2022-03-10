
import crypto from 'crypto'
import jwt from 'jsonwebtoken'  //!not jwt-decode!!! 
import UserModel from '../03-models/user-model'


///////////////////////////////////////////////
const salt = "MakeThingsGoRight"

function hash(plainText:string):string {
    if (!plainText) return null 
//!dont forget createHmac not hmac
    const hashedText = crypto.createHmac('sha512', salt).update(plainText).digest('hex')
    return hashedText
}



///////////////////////////////////////////////
const secretKey = "KittensAreCute"

function getNewToken(user:UserModel):string {
   const payload = {user}

    const token = jwt.sign(payload, secretKey, {expiresIn: '2h'})
    return token

}


///////////////////////////////////////////////
function verifyToken(authorizationHeader: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!authorizationHeader) {
          resolve(false)
          return 
      }

       // Extract the token ("Bearer given-token"):
      const token = authorizationHeader.split(' ')[1]

      if (!token) {
          resolve(false)
          return
      }

      jwt.verify(token, secretKey, err => {
          if (err) {
              resolve(false)
              return 
          }
          resolve(true)
      })



    })
}


function getUserFromToken(authorizationHeader: string):UserModel {
    //Extract token
    const token = authorizationHeader.split(' ')[1]

    //Extract payload from the token  //payload = {{}}
    const payload:any = jwt.decode(token)  //{{}}

    //Extract user   //user {}
    const user = payload.user  //{}

    return user //and inside user {} we hae the role 
}






export default {
    hash,
    getNewToken,
    verifyToken,
    getUserFromToken
}