import { OkPacket } from "mysql";
import cyber from "../01-utils/cyber";
import CredentialsModel from "../03-models/credentials-model";
import ErrorModel from "../03-models/error-model";
import UserModel from "../03-models/user-model";
import dal from "../04-dal/dal";
import {v4 as uuid} from 'uuid'


// new register that supprots uuid: 
async function register(user: UserModel):Promise<string> {

    //Validation
   const errors = user.validatePost()
   if (errors) throw new ErrorModel(400, errors)

  
   

   const isTaken =  await isUsernameTaken(user.username)
   if (isTaken) throw new ErrorModel(400, `Username ${user.username} already taken.`)

   

   //hash password and salt it before sending to sql tables
   user.password = cyber.hash(user.password)

   user.id = uuid()
   console.log("user.id", user.id);  //8080f83d-d2e1-475c-8923-3ac62a8655a0

//    const sql = `INSERT INTO Users VALUES(DEFAULT, ?,?, ?,?)`
   const sql = `INSERT INTO Users VALUES(?, ?,?, ?,?)`

   const info: OkPacket = await dal.execute(sql, [user.id , user.firstName, user.lastName, user.username, user.password])
//    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password])

//    user.id = info.insertId // We dont want to give him default auto_Increment number from datase anymore



// i entered this: 
// {
//     "firstName": "abcd",
//     "lastName": "abcd",
//     "username": "abcd",
//     "password": "abcd"
// }  and got this: 
console.log('user', user)
// UserModel {
//     id: '89884f33-68f7-4697-8fad-07de2d44f260',
//     firstName: 'abcd',
//     lastName: 'abcd',
//     username: 'abcd',
//     password: '1611ee302fa9a366b6cddafd095bfd705b487e839e9278e76bbae34d49274fa2a9d15645b05f42814003dfed7d0dc715a1e5799007ffaca55e86cc39f6ce94b4',
//     role: 1
//   }

delete user.password
// and this is what jwt token looks like: 
// {
//     "user": {
//       "id": "89884f33-68f7-4697-8fad-07de2d44f260",
//       "firstName": "abcd",
//       "lastName": "abcd",
//       "username": "abcd",
//       "role": 1
//     },
//     "iat": 1646880631,
//     "exp": 1646887831
//   }



   //generate token   //actually user has the role of 1 (even though we didnt put it yet in database but we making a token with user which has a role of 1 from the controller)
    const token = cyber.getNewToken(user)

    return token 
}

// OLD register!
// async function register(user: UserModel):Promise<string> {

//     //Validation
//    const errors = user.validatePost()
//    if (errors) throw new ErrorModel(400, errors)

//    const isTaken =  await isUsernameTaken(user.username)
//    if (isTaken) throw new ErrorModel(400, `Username ${user.username} already taken.`)

//    //hash password and salt it before sending to sql tables
//    user.password = cyber.hash(user.password)

//    const sql = `INSERT INTO Users VALUES(DEFAULT, ?,?, ?,?)`

//    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password])

//    user.id = info.insertId //! We dont want to give him default auto_Increment number from datase anymore
//    console.log('user', user)
//    delete user.password


//    //generate token   //actually user has the role of 1 (even though we didnt put it yet in database but we making a token with user which has a role of 1 from the controller)
//     const token = cyber.getNewToken(user)

//     return token 
// }



// btw password is abcd as well

async function login(credentials: CredentialsModel):Promise<string> {
// Validation
  const errors = credentials.validatePost()
  if (errors) throw new ErrorModel(400, errors)

  // Hash password before comparing to database:
  credentials.password = cyber.hash(credentials.password)  //btw the password on the frontend can be abcd or 1234 !!!! but in database we see something else so dont get confused in postman!!! you still need to give the original password each time that you dont see!!!

  const sql = `SELECT * FROM Users 
               WHERE username =  ? AND password = ?`

const users = await dal.execute(sql, [credentials.username, credentials.password])

// if (!users) {  //!wrong its an array 
if (users.length === 0) {  //!wrong its an array 
    throw new ErrorModel(401, `Incorrect username or password`)
}
console.log('users', users);
// [   after we hashed the passwords we get users that have a hashes password but still //! in postman or http we need to send original password!! 
//     RowDataPacket {
//       id: 7,  //! btw soon this will be a uuid 
//       firstName: 'Kermit',
//       lastName: 'The-Frog',
//       username: 'Kermit',
//       password: 'dd6ff49baeb6802c954201a4216f690810451a9991247ebe7fd62556bc68218071c7e27de059fecde889215a9a5c17f30d8c87f03c339818fbaa61ca18cd756b'  //hashed!!!!!!!!!!!!
//     }
//   ]

//btw password is abcd as well you must enter abcd to login but password below is of the database

// {
//     id: '89884f33-68f7-4697-8fad-07de2d44f260',
//     firstName: 'abcd',
//     lastName: 'abcd',
//     username: 'abcd',
//    password:'1611ee302fa9a366b6cddafd095bfd705b487e839e9278e76bbae34d49274fa2a9d15645b05f42814003dfed7d0dc715a1e5799007ffaca55e86cc39f6ce94b4'
//   }

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