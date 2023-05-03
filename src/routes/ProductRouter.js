import express from "express";
import { getProduct, getProductID, createProduct, updatedProduct, deleteProduct } from "../controllers/ProductController.js";
import {isLoggedIn} from "../controllers/middleware.js"

const ProductRouter = express.Router();

ProductRouter.get("/", isLoggedIn, getProduct);

ProductRouter.get("/:id", getProductID);

ProductRouter.post("/",createProduct);

ProductRouter.put("/:id", updatedProduct);

ProductRouter.delete("/:id", deleteProduct);


export default ProductRouter;