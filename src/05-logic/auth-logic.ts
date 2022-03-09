import { OkPacket } from "mysql";
import cyber from "../01-utils/cyber";
import CredentialsModel from "../03-models/credentials-model";
import ErrorModel from "../03-models/error-model";
import UserModel from "../03-models/user-model";
import dal from "../04-dal/dal";



async function register(user: UserModel):Promise<string> {

    //Validation
   const errors = user.validatePost()
   if (errors) throw new ErrorModel(400, errors)

   const isTaken =  await isUsernameTaken(user.username)
   if (isTaken) throw new ErrorModel(400, `Username ${user.username} already taken.`)

   //hash password and salt it before sending to sql tables
   user.password = cyber.hash(user.password)

   const sql = `INSERT INTO Users VALUES(DEFAULT, ?,?, ?,?)`

   const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password])

   user.id = info.insertId //! for now 
   console.log('user', user)
   delete user.password


   //generate token   //actually user has the role of 1 (even though we didnt put it yet in database but we making a token with user which has a role of 1 from the controller)
    const token = cyber.getNewToken(user)

    return token 
}

async function login(credentials: CredentialsModel):Promise<string> {
// Validation
  const errors = credentials.validatePost()
  if (errors) throw new ErrorModel(400, errors)

  // Hash password before comparing to database:
  credentials.password = cyber.hash(credentials.password)

  const sql = `SELECT * FROM Users 
               WHERE username =  ? AND password = ?`

const users = await dal.execute(sql, [credentials.username, credentials.password])

// if (!users) {  //!wrong its an array 
if (users.length === 0) {  //!wrong its an array 
    throw new ErrorModel(401, `Incorrect username or password`)
}
console.log('users', users);

// Get user:
const user = users[0]

//Remove password
delete user.password

const token = cyber.getNewToken(user)

return token
}









async function isUsernameTaken(username: string): Promise<boolean> {
//   const sql = `SELECT * FROM users
//                WHERE username = '${user.username}'`

const sql = `SELECT COUNT(*) AS count
             FROM Users
             WHERE username = ?`

             const table = await dal.execute(sql,[username])   //dont forget to await
             const row = table[0]
             const count = row.count 
             return count > 0

}



export default {
    register,
    login
}