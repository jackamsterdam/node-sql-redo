import  { UploadedFile } from "express-fileupload";
import Joi from "joi";

class ProductModel {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageName: string;
    image: UploadedFile
    //!add image

    constructor(product: ProductModel) {
        this.id = product.id 
        this.name = product.name
        this.price = product.price 
        this.stock = product.stock 
        this.imageName = product.imageName
        this.image = product.image 
    }

    private static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        name: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(1000),
        stock: Joi.number().required().integer().min(0).max(10000),
        image: Joi.object().optional(),  //object!
        imageName: Joi.string().optional()
    })

    validatePost():string {
        const result = ProductModel.postValidationSchema.validate(this, {abortEarly: false})
        return result.error?.message   //!error not errors
    }

    private static putValidationSchema = Joi.object({
        id: Joi.number().required().integer().min(1),
        name: Joi.string().required().min(2).max(100),
        price: Joi.number().required().min(0).max(1000),
        stock: Joi.number().required().integer().min(0).max(10000),
        image: Joi.object().optional(), 
        imageName: Joi.string().optional()
    })

    validatePut():string {
        const result = ProductModel.putValidationSchema.validate(this, {abortEarly: false})
        return result.error?.message
    }

    private static patchValidationSchema = Joi.object({
        id: Joi.number().required().integer().min(1),
        name: Joi.string().optional().min(2).max(100),
        price: Joi.number().optional().min(0).max(1000),
        stock: Joi.number().optional().integer().min(0).max(10000),
        image: Joi.object().optional(),
        imageName: Joi.string().optional()
    })

    validatePatch():string {
        const result = ProductModel.patchValidationSchema.validate(this, {abortEarly: false})
        return result.error?.message
    }
}

export default ProductModel