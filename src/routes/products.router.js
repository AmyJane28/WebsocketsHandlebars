import {Router} from 'express'
import {productsManager} from '../ProductManager.js'

const router = Router()

//Listar todos los productos, incluyendo limit
router.get("/", async (req, res) => {
    try {
        const products = await productsManager.getProduct(req.query)
        if (!products.length) {
            return res.status(200).json({message: "No products" })
        }
        res.status(200).json({message: "Products found", products})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//Traer solo el producto proporcionado por el id
router.get("/:idProduct", async (req, res)=>{
    const {idProduct} = req.params
    try {
        const product = await productsManager.getProductById(+idProduct)
        if (!product) {
            return res.status(404).json({message: "No product found with this id" })
        }
        res.status(200).json({message: "Product found", product})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

//Agregar nuevo producto
router.post("/", async(req,res)=>{
    const {title, description, code, price,stock,category} = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).json({message: 'Required data is missing'})
    }
    try {
        const newProduct = await productsManager.addProduct(req.body)
        res.status(200).json({message: 'Product created', product: newProduct})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Método PUT para actualizar
router.put("/:idProduct", async (req, res) => {
    const { idProduct } = req.params;
    try {
      const response = await productsManager.updateProduct(+idProduct, req.body);
      if (!response) {
        return res.status(404).json({ message: "Product not found with the id provided" });
      }
      res.status(200).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//Eliminar productos
router.delete("/:idProduct", async (req,res)=>{
    const {idProduct} = req.params;
    try {
        const product= await productsManager.getProductById(+idProduct)
        if (!product) {
            return res.status(404).json({message: "No product found with this id"})
        }
        await productsManager.deleteProduct(+idProduct)
        res.status(200).json({message: "Product deleted"})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

export default router