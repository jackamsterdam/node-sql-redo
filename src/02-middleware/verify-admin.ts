import { NextFunction, Request, Response } from "express";
import cyber from "../01-utils/cyber";
import ErrorModel from "../03-models/error-model";
import UserEnum from "../03-models/userEnum";

async function verifyAdmin(request: Request, response: Response, next: NextFunction):Promise<void> {

     const authorizationHeader = request.header('authorization')
     const isValid = await cyber.verifyToken(authorizationHeader)
     if (!isValid) {
         next(new ErrorModel(401, `You are not logged in.`))
         return //!
     }

    //  const user = cyber.getUserFromToken(BAD:::::request.body) //! absolutely not!! we are getting the token from the interceptor in React because user is already registered or loggged in he is not sending a UserModel or CredentialModel but he is sending a Bearer Token!
     const user = cyber.getUserFromToken(authorizationHeader)
     if (user.role !== UserEnum.Admin){
     
          next(new ErrorModel(403, `Forbidden: You are not authorized`))
          return// !
         }
     


    next()
}

export default verifyAdmin