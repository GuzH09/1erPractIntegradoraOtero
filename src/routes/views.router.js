import { Router } from "express";
import ProductManagerDB from '../dao/ProductManagerDB.js';
import messageManagerDB from '../dao/MessageManagerDB.js';

const viewsRouter = Router();
const PM = new ProductManagerDB();
const CHM = new messageManagerDB();

// Show All Products
viewsRouter.get('/', async (req, res) => {
    let products = await PM.getProducts();
    res.render(
        "home",
        {
            products: products,
            style: "index.css"
        }
    );
});

// Show All Products with Websockets
viewsRouter.get('/realtimeproducts', async (req, res) => {
    let products = await PM.getProducts();
    res.render(
        "realTimeProducts",
        {
            products: products,
            style: "realTimeProducts.css"
        }
    );
});

// Chat App with Websockets
viewsRouter.get('/chat', async (req, res) => {
    let messages = await CHM.getAllMessages();
    res.render(
        "chat",
        {
            messages: messages,
            style: "chat.css"
        }
    );
});

export default viewsRouter;