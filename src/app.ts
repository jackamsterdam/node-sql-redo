
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.NODE_ENV)  //development

import express , { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import logRequests from './02-middleware/log-requests'
import expressFileUpload from "express-fileupload";
import errorsHandler from './02-middleware/errors-handler'
import config from './01-utils/config'
import ErrorModel from './03-models/error-model';
import path from 'path';
import productsController from './06-controllers/products-controller'
import authController from './06-controllers/auth-controller'
import usersController from './06-controllers/users-controller'

const server = express()

if (config.isDevelopment) {
server.use(cors({origin: ['http://localhost:3000', 'http://localhost:4200']}))
}
server.use(express.json())
server.use(expressFileUpload());

server.use(logRequests)
server.use('/api', authController)
server.use('/api', usersController)
server.use('/api', productsController)






// Expose index.html from 07-frontend directory:
const frontEndDir = path.join(__dirname, '07-frontend') // Create full path to frontend 
server.use(express.static(frontEndDir)) // Serve index.html when user request root url.



//Route not found:
server.use('*', (request: Request, response: Response, next: NextFunction) => {
     // On development - return 404 error
    if (config.isDevelopment) {
        next(new ErrorModel(404, `Route not found.`))
    } else { // On production - return index.html to show desired page or page-not-found:
      const indexHtmlFile = path.join(__dirname, '07-frontend', 'index.html')
      response.sendFile(indexHtmlFile)
    }
})

server.use(errorsHandler)

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.port}`))

