import { Router } from "express";
import {ProductManager} from "../ProductManager.js"


const router = Router();

router.get("/", (req, res) => {
    res.render("websocket")
})

routerViews.get("/", async (req, res) => {
    let products = await productManager.getProduct();
  
    res.render("home", {
      products: products,
    });
  });
  
  routerViews.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
  });
  
  export { routerViews };


export default router;