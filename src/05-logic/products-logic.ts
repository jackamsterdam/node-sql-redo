import { OkPacket } from "mysql";
import ErrorModel from "../03-models/error-model";
import ProductModel from "../03-models/product-model";
import dal from '../04-dal/dal'


async function getAllProducts():Promise<ProductModel[]> {
  const sql = `SELECT 
                ProductId AS id,
                ProductName AS name, 
                UnitPrice AS price , 
                UnitsInStock AS stock

                FROM Products`
//!add imagename 
  const products = await dal.execute(sql);

  return products 
}

async function getOneProduct(id: number): Promise<ProductModel> {
   const sql = `SELECT 
                  ProductId AS id,
                  ProductName AS name,
                  UnitPrice AS price,
                  UnitsInStock AS stock
                  
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

    const errors = product.validatePost()
    if (errors) throw new ErrorModel(400, errors)

    const sql = `INSERT INTO Products(ProductName, UnitPrice, UnitsInStock)
                 VALUES(?, ?, ?)`

  const info: OkPacket = await dal.execute(sql, [product.name, product.price, product.stock])

  product.id = info.insertId
  console.log("product", product);

  return product
}

async function updateFullProduct(product: ProductModel): Promise<ProductModel> {
  
  const errors = product.validatePut()
  if (errors) throw new ErrorModel(400, errors)
 //Products is our table (not product cause tables are with an s )
  const sql = `UPDATE Products
               SET 
               ProductName = ?, UnitPrice =  ?, UnitsInStock = ?
               WHERE ProductId = ?`

  const info: OkPacket = await dal.execute(sql, [product.name, product.price, product.stock, product.id])


  if (info.affectedRows === 0) throw new ErrorModel(404, `Resource with id ${product.id} not found.`)

 return product

}

async function updatePartialProduct(product:ProductModel): Promise<ProductModel> {

      const errors = product.validatePatch()
      if (errors) throw new ErrorModel(400, errors)
      //btw if employees you would have to turn the date to .toString()

      //so we want to get one product so we can for ...in  our props in product that we want to change in dbProduct we just got after we changed it we can send this updated product to async put updateFullProduct (BUT OFCOURSE we need to make sure its an instance of productModel because what we get back from database is just an instance) and that will update the product in database.
console.log(product)  // { id: 98, name: undefined, price: 88, stock: undefined }
      const dbProduct = await getOneProduct(product.id)

      for (const prop in product) {
        if (product[prop]) {
          dbProduct[prop] = product[prop]
        }
      }
console.log(dbProduct)
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

      const updatedProduct = await updateFullProduct(new ProductModel(dbProduct))
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