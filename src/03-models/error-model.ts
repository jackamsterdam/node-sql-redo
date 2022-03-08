
class ErrorModel {
  status: number 
  message: string 

  constructor(status: number, message: string) {
      this.status = status 
      this.message = message  //be careful message not messssage
  }
}

export default ErrorModel
