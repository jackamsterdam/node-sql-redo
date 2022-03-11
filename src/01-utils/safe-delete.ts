import fs from 'fs'
//!change to async
   //fullpath string?
function safeDelete(fullPath:string) {
  try {
    if (!fullPath || !fs.existsSync(fullPath)) return 

    fs.unlinkSync(fullPath)

  } catch(err: any) {
      
  }
}


export default safeDelete