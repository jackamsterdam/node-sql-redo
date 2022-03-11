import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import verifyAdmin from '../02-middleware/verify-admin'
import verifyLoggedIn from '../02-middleware/verify-logged-in'
import ProductModel from '../03-models/product-model'
import productsLogic from '../05-logic/products-logic'

const router = express.Router()
  //add verifyLoggedIn חסימה
router.get('/products', async (request: Request, response: Response, next: NextFunction) => {
    try {
         const products = await productsLogic.getAllProducts()
         response.json(products)

    } catch (err: any) {
        next(err)
    }
}) 

router.get('/products/:id', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id
        const product = await productsLogic.getOneProduct(id)
        response.json(product)
    } catch (err: any) {
        next(err)
    }
})

router.post('/products', verifyLoggedIn,async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.pic 
        const product = new ProductModel(request.body)
        const addedProduct = await productsLogic.addProduct(product)
        response.status(201).json(addedProduct)
    } catch (err: any) {
        next(err)
    }
})

router.put('/products/:id', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.pic
        const id = +request.params.id
        request.body.id = id 
        const product = new ProductModel(request.body)
        const udpatedProduct = await productsLogic.updateFullProduct(product)
        response.json(udpatedProduct)
    } catch (err: any) {
        next(err)
    } 
})

router.patch('/products/:id', verifyLoggedIn, async (request: Request, response: Response, next: NextFunction) => {
    try {
        //לחלץ id
        request.body.image = request.files?.pic
        const id = +request.params.id 
        request.body.id = id 
        const product = new ProductModel(request.body)
        const updatedProduct = await productsLogic.updatePartialProduct(product)
        response.json(updatedProduct)
    } catch (err: any) {
        next(err)
    }
})

router.delete('/products/:id', verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
         const id = +request.params.id 
         await productsLogic.deleteProduct(id)
         response.sendStatus(204)
    } catch (err: any) {
        next(err)
    }
})

//הנגשת תמונה  dont forget :imageName  : and big N 
router.get('/products/images/:imageName', async (request: Request, response: Response, next: NextFunction) => {
    try {
   
        const imageName = request.params.imageName
        const absolutePath = path.join(__dirname, '..', 'assets', 'images', 'products', imageName)
        response.sendFile(absolutePath)


    } catch (err: any) {
        next(err)
    }
})

// Bonus: 

// price cheaper than 
router.get('/products/cheaper-than/:num',async (request: Request, response: Response, next: NextFunction) => {
    try {
        const num = +request.params.num
        const products = await productsLogic.cheaperThan(num)
        response.json(products)



    } catch (err: any) {
        next(err)
    }
})

// price more expensive then 
router.get('/products/expensive-than/:num',async (request: Request, response: Response, next: NextFunction) => {
    try {
        const num = +request.params.num
        const products = await productsLogic.expensiveThan(num)
        response.json(products)
        
    } catch (err: any) {
        next(err)
    }
})




export default router 