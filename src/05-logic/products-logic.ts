import { OkPacket } from "mysql";
import ErrorModel from "../03-models/error-model";
import ProductModel from "../03-models/product-model";
import dal from '../04-dal/dal'
import {v4 as uuid} from 'uuid'
import safeDelete from "../01-utils/safe-delete";


async function getAllProducts():Promise<ProductModel[]> {
  const sql = `SELECT 
                ProductId AS id,
                ProductName AS name, 
                UnitPrice AS price , 
                UnitsInStock AS stock,
                
                CONCAT(ProductID, '.jpg') AS imageName

                FROM Products`
//!add imagename 
  const products = await dal.execute(sql);

  return products 
}

async function getOneProduct(id: number): Promise<ProductModel> {   //BTW this code is used in REACT to get one product and for update edit one product when you want to populate the form!!!!
  //! you can add to database a column called imageName and then you wouldnt need to do it that way: you can just imageName AS imageName
   const sql = `SELECT 
                  ProductId AS id,
                  ProductName AS name,
                  UnitPrice AS price,
                  UnitsInStock AS stock,

                  CONCAT(ProductID, '.jpg') AS imageName
                  
                  FROM Products
                  WHERE ProductId = ?`

                  //!add imagename

     const products = await dal.execute(sql,[id])
    //  console.log("products", products);  //[ RowDataPacket { id: 1, name: 'Chai', price: 18, stock: 39 } ]
     const product = products[0]
     if(!product) throw new ErrorModel(404, `Resource with id ${id} not found.`)


     return product 
}

async function addProduct(product: ProductModel): Promise<ProductModel> {
console.log('product', product);
// ProductModel {
//   id: 102,
//   name: 'george5',
//   price: '33',
//   stock: '55',
//   imageName: undefined,
//   image: {
//     name: '20160223_175210.JPG',
//     data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 07 7a 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0a 01 0f 00 02 00 00 00 06 00 00 ... 1186733 more bytes>,
//     size: 1186783,
//     encoding: '7bit',
//     tempFilePath: '',
//     truncated: false,
//     mimetype: 'image/jpeg',
//     md5: '619bcd8e444c7063bbd4a17517d3ae1e',
//     mv: [Function: mv]
//   }

    const errors = product.validatePost()
    if (errors) throw new ErrorModel(400, errors)

    //image handling: 
    if (product.image) {
      const extension = product.image.name.substring(product.image.name.lastIndexOf('.'))
      product.imageName = uuid() + extension
      await product.image.mv('./src/assets/images/products/' + product.imageName)
      delete product.image
    }
//!YOu should add a column called imageName in database so you  can insert the imageName in there!1 as of now there is no תיכה
    const sql = `INSERT INTO Products(ProductName, UnitPrice, UnitsInStock)
                 VALUES(?, ?, ?)`

  const info: OkPacket = await dal.execute(sql, [product.name, product.price, product.stock])

  product.id = info.insertId
  console.log("product at end just before return", product);

  return product  //btw we returning the image without the file image just the imageName
}

async function updateFullProduct(product: ProductModel): Promise<ProductModel> {
  
  const errors = product.validatePut()
  if (errors) throw new ErrorModel(400, errors)

  
  console.log('product', product)
  // ProductModel {
  //   id: 104,
  //   name: 'updprodmustard',
  //   price: '77',
  //   stock: '77',
  //   imageName: undefined, //!pay attention even though putwe dont get a imagename. thats why we need to first  give it the imageName in the database  adn then we check if there is a new updated image coming in if ther is we delete the old image and give new imagename BUT if there isnt an image coming in then database will get updated with this imagename the same imageName we gave it that matches the database tahts how it was in coffee example.. BUT here we are returning a CONCat of imagename from database as of now so we dont really need to make sure about this imageName cause its not going in sql anyways so as of now we dont need to do anything like this.
  //   image: {
  //     name: '20160223_155216.JPG',    //!name
  //     data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 07 7a 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0a 01 0f 00 02 00 00 00 06 00 00 ... 1014874 more bytes>,
  //     size: 1014924,
  //     encoding: '7bit',
  //     tempFilePath: '',
  //     truncated: false,
  //     mimetype: 'image/jpeg',
  //     md5: 'a37a3226ab0b9d5d2ee4c549039f4ab0',
  //     mv: [Function: mv]
  //   }
  // }

  // ok so I will first get the imageName that is saved in database first  and only if ther isnt an image coming in they it will stay the Same.
  //handle image:
  const dbProduct = await getOneProduct(product.id)
  product.imageName = dbProduct.imageName   
  console.log("product", product);   //will have a whole product object with: imageName: '104.jpg',  (if we were to save this after it will go in sql in the imagename column)

  if (product.image) {   //!wont work cause 104.jpg you got  but ok just wont delete it lol
     safeDelete('./src/assets/images/products/' + product.imageName)
     const extension = product.image.name.substring(product.image.name.lastIndexOf('.'))
     product.imageName = uuid() + extension 
     await product.image.mv('./src/assets/images/products/' + product.imageName)
     delete product.image
   
  }
  //and then we update the products with new imageName if i would have had that column lol






 //Products is our table (not product cause tables are with an s )
  const sql = `UPDATE Products
               SET 
               ProductName = ?, UnitPrice =  ?, UnitsInStock = ?
               WHERE ProductId = ?`

  const info: OkPacket = await dal.execute(sql, [product.name, product.price, product.stock, product.id])


  if (info.affectedRows === 0) throw new ErrorModel(404, `Resource with id ${product.id} not found.`)

  console.log('product before send back', product)
  // {
  //   id: 104,
  //   name: 'updprodmustard',
  //   price: '77',
  //   stock: '77',
  //   imageName: 'b9a4b53b-1fb1-4249-8c70-49122f5fa13c.JPG'
  // }
 return product

}

async function updatePartialProduct(product:ProductModel): Promise<ProductModel> {

      const errors = product.validatePatch()
      if (errors) throw new ErrorModel(400, errors)
      //btw if employees you would have to turn the date to .toString()

      //so we want to get one product so we can for ...in  our props in product that we want to change in dbProduct we just got after we changed it we can send this updated product to async put updateFullProduct (BUT OFCOURSE we need to make sure its an instance of productModel because what we get back from database is just an instance) and that will update the product in database.
console.log(product)  // { id: 98, name: undefined, price: 88, stock: undefined }
// {
//   id: 84,
//   name: undefined,
//   price: undefined,
//   stock: 999,
//   imageName: undefined,
//   image: undefined
// }
      const dbProduct = await getOneProduct(product.id)
      console.log("dbProduct", dbProduct);
      // RowDataPacket {
      //   id: 84,
      //   name: 'davidjack',
      //   price: 999,
      //   stock: 999,
      //   imageName: '84.jpg'
      // }

      //handle image:
       product.imageName = dbProduct.imageName
       if (product.image) {            //!wont work cause 104.jpg you got  but ok just wont delete it lol
        safeDelete('./src/assets/images/products/' + product.imageName)//wont work cause actually wont find it cause database doesnt save the correct uuid imagename not yet but doesnt matter if doesnt delte it cause it will just stay there 
        const extension = product.image.name.substring(product.image.name.lastIndexOf('.'))
        product.imageName = uuid() + extension 
        await product.image.mv('./src/assets/images/products/' + product.imageName)
        delete product.image
       }

 


      for (const prop in product) {
        if (product[prop]) {
          dbProduct[prop] = product[prop]
        }
      }
console.log('dbProduct', dbProduct)
// RowDataPacket {
//   id: 98,
//   name: 'Amazing Falafel',
//   price: 88,
//   stock: 200,
//   validatePost: [Function (anonymous)],
//   validatePut: [Function (anonymous)], 
//   validatePatch: [Function (anonymous)]
// }
      //now we have an updated dbProduct so lets send it to the PUT funciton (it will have to pass validation again) BUT pass it a ProductModel instance
//!now that we have an image maybe not best idea to send it through put  cause there is too much repetition in there.
      const updatedProduct = await updateFullProduct(new ProductModel(dbProduct))
      console.log("updatedProduct", updatedProduct);

      return updatedProduct 
}

async function deleteProduct(id: number): Promise<void> {
   const sql = `DELETE FROM Products 
                WHERE ProductId = ?`
  
  const info:OkPacket = await dal.execute(sql, [id])
  if (info.affectedRows === 0) throw new ErrorModel(404, `Resource with id ${id} not found.`)
}





// bonus: 
async function cheaperThan(num: number): Promise<ProductModel[]> {
      const sql = `SELECT * FROM products 
                   WHERE UnitPrice >= ?
                   ORDER BY UnitPrice ASC;`

      const products = await dal.execute(sql, [num])
      return products 
}

// היופי בסלקט שמחזיר לי כל המוצרי ולא אינפו 
async function expensiveThan(num: number): Promise<ProductModel[]> {
     const sql = `SELECT * FROM products 
                  WHERE UnitPrice <= ?
                  ORDER BY UnitPrice ASC;`

    const products = await dal.execute(sql, [num])
    return products 
}










export default {
    getAllProducts,
    getOneProduct,
    addProduct,
    updateFullProduct,
    updatePartialProduct,
    deleteProduct,
    cheaperThan,
    expensiveThan
}