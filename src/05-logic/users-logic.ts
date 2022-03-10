import ErrorModel from "../03-models/error-model";
import UserModel from "../03-models/user-model";
import dal from "../04-dal/dal";


//! Prevent IDOR attacks Insecure Direct Object Reference

// so im giving the user the user maybe he wants to update his details. 
// hmm  i guess for react in edit details we need to setVALUE from form and fill out the whole table so we use first a getoneuser

// async function getOneUserAsync(id: number): Promise<UserModel> {  //! nope we get a  uuid string!
async function getOneUserAsync(id: string): Promise<UserModel> {  
    // const users = await dal.getAllUsersAsync()
    // const user = users.find(u => u.id === id)
    // if (!user) throw new ErrorModel(404, `Resource with id ${id} not found`)
    // delete user.password  
    // return user 
    
    const sql = `SELECT *   
                 FROM Users 
                 WHERE id= ?`

   const users = await dal.execute(sql, [id])  //חיפוש לפי סטרינג
   console.log("users", users);
   //!before we uuid the database: 
//    [
//     RowDataPacket {
//       id: 1,
//       firstName: 'Moishe',
//       lastName: 'Ufnik',
//       username: 'moshiko',
//       password: '1234'
//     }
//   ]

//!after we uuid the database:   same id (uuid) in token of register and login
// {
//     "id": "89884f33-68f7-4697-8fad-07de2d44f260",
//     "firstName": "abcd",
//     "lastName": "abcd",
//     "username": "abcd"
// }

   const user = users[0]
   console.log("user", user);
//    RowDataPacket {
//     id: 1,
//     firstName: 'Moishe',
//     lastName: 'Ufnik',
//     username: 'moshiko',
//     password: '1234'
//   }

   if (!user) throw new ErrorModel(404, `Resource with id ${id} not found`)
   
  delete user.password

    return user 
}

export default {
    getOneUserAsync
}
//btw you suppsoe to see role but the database doenst have it right now
// RowDataPacket {
//     id: 2,
//     firstName: 'Kipi',
//     lastName: 'Ben-Kipod',
//     username: 'kipodi',
//     password: 'abcd'
//   }


// RowDataPacket {
//     id: 3,
//     firstName: 'Ugi',
//     lastName: 'Fletzet',
//     username: 'ugifletzet',
//     password: 'cool'
//   }

// these have hashed passwords btw : 
// RowDataPacket {
//     id: 7,
//     firstName: 'Kermit',
//     lastName: 'The-Frog',
//     username: 'Kermit',
//     password: 'dd6ff49baeb6802c954201a4216f690810451a9991247ebe7fd62556bc68218071c7e27de059fecde889215a9a5c17f30d8c87f03c339818fbaa61ca18cd756b'
//   }


// RowDataPacket {
//     id: 8,
//     firstName: 'Bart',
//     lastName: 'Simpson',
//     username: 'Bart',
//     password: 'dd6ff49baeb6802c954201a4216f690810451a9991247ebe7fd62556bc68218071c7e27de059fecde889215a9a5c17f30d8c87f03c339818fbaa61ca18cd756b'
//   }