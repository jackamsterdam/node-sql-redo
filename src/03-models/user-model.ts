import Joi from "joi";
import UserEnum from "./userEnum";

class UserModel {
    // id: number //! should be string 
    id: string // UUID now its a string to prevent IDOR Attacks we dont want any user searching by a running number. he ccan see sensitive info.
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: UserEnum

    constructor(user: UserModel) {
        this.id = user.id 
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.username = user.username
        this.password = user.password
        this.role = user.role
    }

    private static postValidationSchema = Joi.object({ //!btw this is used as  joi validation for register 400
        id: Joi.forbidden(),
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        username: Joi.string().required().min(2).max(100),
        password: Joi.string().required().min(2).max(100),
        role: Joi.number().integer().min(UserEnum.User).max(UserEnum.Admin)  //?required
    })

    validatePost(): string {
        const result = UserModel.postValidationSchema.validate(this, {abortEarly: false})
        return result.error?.message
    }
//!this is for editing (updating) the user                   //But this is used for put editing joi validation editing the user! we dont have code to edit update put the user in users logic btw we just have get one user!
    private static putValidationSchema = Joi.object({
        // id: Joi.number().required().integer().positive(),   //! change soon to string()
        id: Joi.string().required().length(36),   //!  the uuid  
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        username: Joi.string().required().min(2).max(100),
        password: Joi.string().required().min(2).max(100),
        role: Joi.number().integer().min(UserEnum.User).max(UserEnum.Admin)  //??????required??
    })

    validatePut():string {
        const result = UserModel.putValidationSchema.validate(this, {abortEarly: false})
        return result.error?.message
    }
}




export default UserModel
