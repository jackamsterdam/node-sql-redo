import Joi from "joi"

class CredentialsModel {
  username: string 
  password: string 

  constructor(credentials: CredentialsModel) {
      this.username = credentials.username
      this.password = credentials.password
  }


  //400 Joi errors - our request.body will turn into an instance with the property validatePost() and if error will give us error 400
  private static postValidationSchema = Joi.object({
      username: Joi.string().required().min(2).max(100),
      password: Joi.string().required().min(2).max(100)
  })

  validatePost():string {
      const result = CredentialsModel.postValidationSchema.validate(this, {abortEarly: false})
      return result.error?.message
  }
}


export default CredentialsModel