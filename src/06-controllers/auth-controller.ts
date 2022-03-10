import express, { NextFunction, Request, Response } from 'express'
import CredentialsModel from '../03-models/credentials-model'
import UserModel from '../03-models/user-model'
import UserEnum from '../03-models/userEnum'
import authLogic from '../05-logic/auth-logic'

const router = express.Router() 
//we dont deal with ids here but users-controller does

router.post('/auth/register', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body)
        //Give User Role (not admin)
        user.role = UserEnum.User
        const token = await authLogic.register(user)
        response.status(201).json(token)


    } catch (err: any) {
        next(err)
    }
})

router.post('/auth/login', async(request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body)
        const token = await authLogic.login(credentials)
        response.json(token)
    } catch (err: any) {
        next(err)
    }
})











export default router