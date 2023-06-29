import express from "express";
import ProductController from "../controllers/productController";
import isAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", isAuth, ProductController.getAllProducts);

router.post("/", isAuth, ProductController.createProduct);

router.post("/buy",isAuth, ProductController.buyProducts);

export default router;
