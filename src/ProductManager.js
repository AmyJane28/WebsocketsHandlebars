import { existsSync, promises } from 'fs';

class ProductManager {
    constructor() {
        this.path = 'Productos.json' 
    }

    //Si existe me lee y lo retorno si no existe regresa un arreglo vacío 
    async getProduct(queryObj = {}) {
        console.log('queryObj', queryObj);
        const { limit } = queryObj;
        try {
            if(existsSync(this.path)) {
                const productsFile = await promises.readFile(this.path, 'utf-8')
                const productsData = JSON.parse(productsFile)
                return limit ? productsData.slice(0, +limit) : productsData;
            } else {
                return [];
            }
        } catch (error) {
            return error
        }
    }

    //Método para agregar productos al array inicial
    async addProduct(product) {
        try {
            
            //Buscamos el arreglo con el método get
            const products = await this.getProduct({})

           /* //Validar que todos los campos sean obligatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Faltan datos! Favor de ingresar datos completos")
            }*/

            //Validar que no se repita el campo code
            for (let i = 0; i < products.length; i++) {
                if (products[i].code === code) {
                    console.log(`El código ${code} ya existe`)
                    break;
                }
            }

            //Incrementar id
            let id
            if (!products.length) {
                id = 1
            }
            else {
                id = products[products.length - 1].id + 1
            }
            //Agregar objetos al arreglo
            const newProduct = { id,...product, status: true };
            products.push(newProduct)
            //Guardamos en el archivo sobreescribiendo si ya existe, si no se va a crear
            await promises.writeFile(this.path, JSON.stringify(products))
            return newProduct;
        } catch (error) {
            return error
        }
    }//Fin del método

    //Método para buscar producto que coincida con el ID solicitado
    async getProductById(id) {
        try {
            const products = await this.getProduct({})
            const product = products.find((p)=>p.id===id)
            if(!product){
                return 'No found'
            } else{
                return product
            }
        } catch (error) {
            throw new Error(error.message);
            
        }
    }

    //Método para eliminar producto
    async deleteProduct(id){
        try {
            const products = await this.getProduct({})
            const product = products.find((p)=> p.id === id)
            if(product){
                const newArrayProducts = products.filter(p=>p.id!==id)
                await promises.writeFile(this.path, JSON.stringify(newArrayProducts))
            }
            return product
        }
        catch (error) {
            return error
        }
    }

    //Actualizar
    async updateProduct(id, obj){
        try {
            const products= await this.getProduct({})
            const index = products.findIndex((p) => p.id == id)
            if(index == -1){
                return null
            }
            const updateProduct = {...products[index],...obj}
            products.splice(index,1, updateProduct)
            await promises.writeFile(this.path, JSON.stringify(products))
            return updateProduct
        } catch (error) {
            return error
            
        }
    }



}//Fin de la clase


/*async function test(){
    const product = new ProductManager
    await product.addProduct('producto1', 'Producto prueba1', 15, ['imagen1'], 'c1', 55,"categoria1")
    await product.addProduct('producto2', 'Producto prueba2', 10, ['imagen2'], 'c2', 25,"categoria1")
    await product.addProduct('producto3', 'Producto prueba3', 21, ['imagen3'], 'c3', 15,"categoria2")
    await product.addProduct('producto4', 'Producto prueba4', 15, ['imagen4'], 'c4', 31,"categoria4")
    await product.addProduct('producto5', 'Producto prueba5', 50, ['imagen5'], 'c5', 58,"categoria3")
    await product.addProduct('producto6', 'Producto prueba6', 20, ['imagen6'], 'c6', 15,"categoria3")
    await product.addProduct('producto7', 'Producto prueba7', 14, ['imagen7'], 'c7', 12,"categoria4")
    await product.addProduct('producto8', 'Producto prueba8', 10, ['imagen8'], 'c8', 20,"categoria2")
    await product.addProduct('producto9', 'Producto prueba9', 60, ['imagen9'], 'c9', 30,"categoria1")
    await product.addProduct('producto10', 'Producto prueba10', 12, ['imagen10'], 'c10', 50,"categoria2")
    const products = await product.getProduct()
    console.log(products)
    //await product.deleteProduct(1)
    //await product.getProductById(2)
}
test()*/

//Exportamos para poder usarla desde app.js
export const productsManager = new ProductManager();