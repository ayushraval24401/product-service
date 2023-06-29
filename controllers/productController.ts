import { Request, Response, NextFunction, response } from "express";
import productRepository from "../repositories/productRepository";
import { receiveMessage, sendMessage } from "../queues/productQueue";
import ExtendedRequest from "../interfaces/extendedRequest";

class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productRepository.get();
      return res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    } catch (err) {
      console.log("Error in getProducts");
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price } = req.body;
      const product = await productRepository.post(name, description, price);
      return res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (err) {
      console.log("Error in getProducts");
    }
  }

  async buyProducts(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;

      const products = await productRepository.getByIds(ids);

      sendMessage("ORDER", {
        products: products,
        userEmail: req?.user?.email,
        userId: req?.user?._id,
      });

      await receiveMessage("PRODUCT")
        .then((response) => {
          return res.status(200).json({
            data: response,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            data: response,
            message: "Something went wrong in order to receive",
          });
        });
    } catch (err) {}
  }
}

export default new ProductController();
