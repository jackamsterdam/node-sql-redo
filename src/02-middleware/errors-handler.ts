import { NextFunction, Request, Response } from "express";
import config from "../01-utils/config";
import logger from "../01-utils/log-helper";
import ErrorModel from "../03-models/error-model";

function errorsHandler(err: any, request: Request, response: Response, next: NextFunction):void {

    console.log('err instanceof Error',err instanceof Error) 
    console.log('err instanceof ErrorModel',err instanceof ErrorModel)

    if (err instanceof Error) {
        logger.error(err.message )
        const msg = config.isDevelopment ? err.message : 'Some error occured, please try again...'
        response.status((err as any).status || 500).send(msg)  //!json???????
        return //! why return 
    }

    if (err instanceof ErrorModel) {
        logger.info(err.message)  //just for me to see
    //     // const msg = config.isDevelopment ? err.message : 'Some error occured, please try again...'
        response.status(err.status).send(err.message)
        return //!why return 

    }


 
    // next nope 
}

export default errorsHandler