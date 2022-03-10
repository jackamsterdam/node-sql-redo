import express,  { NextFunction, Request, Response } from "express"
import usersLogic from "../05-logic/users-logic";
// import UserEnum from "../03-models/userEnum";  //Probable better to call the enum Role and then do import Role from '../03-models/role
// import verifyRole from '../6-middleware/verify-role';
// TODO verifyRole

const router = express.Router()

// so you cant change you rdetails if you didnt log in  so we need to verifyRole 
// router.get('/users/:id([0-9]+)', verifyRole(Role.User), async (request: Request, response: Response, next: NextFunction) => {
// router.get('/users/:id([0-9]+)', async (request: Request, response: Response, next: NextFunction) => {
router.get('/users/:id', async (request: Request, response: Response, next: NextFunction) => {
    try {
        // const id = +request.params.id;
        const id = request.params.id;   //we send the uuid string
        const user = await usersLogic.getOneUserAsync(id)
        response.json(user)
    } catch (err: any) {
        next(err)
    }
})


export default router