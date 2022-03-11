import { NextFunction, Request, Response } from 'express';
import stripTags from 'striptags'


function sanitize(request: Request, response: Response, next: NextFunction):void {
   

for (const prop in request.body) {
    //you dont care about the type of prop you care about the typeof VALUE of the propty
    if (typeof request.body[prop] === 'string') {
        request.body[prop] = stripTags(request.body[prop])
    }
}

    next()
}





export default sanitize