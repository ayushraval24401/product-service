import ProductModel from "../models/productModel";

class ProductRepository {
  async get() {
    const products = await ProductModel.find();
    return products;
  }

  async getByIds(ids: []) {
    const products = await ProductModel.find({ _id: { $in: ids } });
    return products;
  }

  async post(name: string, description: string, price: number) {
    const product = await ProductModel.create({ name, description, price });
    return product;
  }
}

export default new ProductRepository();
