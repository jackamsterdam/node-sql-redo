import Joi from "joi";
import UserEnum from "./userEnum";

class UserModel {
    id: number //!string soon
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

    private static postValidationSchema = Joi.object({
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

    private static putValidationSchema = Joi.object({
        id: Joi.number().required().integer().positive(),   //! change soon to string()
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
