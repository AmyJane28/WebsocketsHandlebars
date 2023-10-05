import express from 'express'
import {engine} from 'express-handlebars'
import { __dirname } from './utils.js'
import viewsRouter from './routes/views.router.js'
import { Server, Socket } from 'socket.io'
import {routerProduct} from "./routes/products.router.js"
import { productsManager } from './ProductManager.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

//Handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")

//Endpoints
app.use("/api/views", viewsRouter)
app.use("/api/products", routerProduct);

const httpServer = app.listen(8080, () => {
    console.log("Server is listening on port 8080")
})

const socketServer = new Server(httpServer)

/*/Escuche un evento para ver los clientes que se conectan
socketServer.on("connection", socket=> {
    console.log(`Cliente conectado", ${socket.id}`);
    //Evento para ver cliente que se desconecte
    socket.on("disconnect", ()=> {
        console.log((`Cliente desconectado: ${socket.id}`));
    })
    //Emite un evento llamado welcome y envia este mensaje "Welcome to Websocket"
    socket.emit("welcome", "Welcome to Websocket")
})*/

socketServer.on("connection", async (socket) => {

    console.log("CLIENTE CONECTADO");
  
    const productosOld = await productManager.getProduct();
  
    socket.emit("productsInitial", productosOld);
  
    socket.on("addProduct", async (product) => {
      const producto = await productManager.addProduct(product);
  
      const productosActualizados = await productManager.getProduct();
  
      socket.emit("productUpdate", productosActualizados);
  
      console.log(product);
    });
  
    socket.on("deleteProduct", async (productId) => {
      const productosOld = await productManager.getProduct();
  
      const producto = await productManager.deleteProductById(+productId);
  
      const productosActualizados = await productManager.getProduct();
  
      socket.emit("productDelete", productosActualizados);
  
  
    });
  
  
  
  
  });
  