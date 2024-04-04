import { Router } from "express";
import ProductManagerDB from "../dao/ProductManagerDB.js";
import { uploader } from "../utils/multerUtil.js";

const productsRouter = Router();
const PM = new ProductManagerDB();

// Get All Products - Get All Products With Limit
productsRouter.get('/', async (req, res) => {
    let {limit} = req.query;
    let products = await PM.getProducts();
    if (limit) {
        products = products.slice(0, parseInt(limit));
    }
    res.send({products});
});

// Get Product By Id
productsRouter.get('/:pid', async (req, res) => {
    let productId = req.params.pid;
    const products = await PM.getProductById(productId);
    products['error'] ? res.status(400).send(products) : res.send({...products, _id: products._id.toString()});
});

// Create New Product
productsRouter.post('/', uploader.array('thumbnails'), async (req, res) => {
    if (!req.files) {
        return res.status(400).send({error: "Error uploading image."})
    }

    const thumbnails = req.files.map(file => file.path);

    // Get Product Data from Body
    let { title, description, code, price, stock, category } = req.body;

    // Status is true by default
    // Thumbnails is not required, [] by default
    const newObjectData = {title, description, code, price, stock, category, thumbnails};
    const result = await PM.addProduct(newObjectData);
    result['success'] ? res.status(201).send(result) : res.status(400).send(result);
});

// Update Existing Product
productsRouter.put('/:pid', async (req, res) => {
    // Get Product Data from Body
    let { title, description, code, price, stock, category, thumbnails } = req.body;
    // Get Product Id from Params
    let productId = req.params.pid;

    const newObjectData = {title, description, code, price, stock, category, thumbnails};
    const result = await PM.updateProduct( productId, newObjectData );
    result['success'] ? res.status(201).send(result) : res.status(400).send(result);
});

// Delete Existing Product
productsRouter.delete('/:pid', async (req, res) => {
    // Get Product Id from Params
    let productId = req.params.pid;
    const result = await PM.deleteProduct(productId);
    result['success'] ? res.status(201).send(result) : res.status(400).send(result);
});

export default productsRouter;