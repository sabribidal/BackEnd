import { ProductManager } from './ProductManager.js'
import express from 'express'

const app = express()
const PORT = 8080
const productManager = new ProductManager();

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    // cuando se proporciona un límite se devuelven los primeros productos
    const limitedProducts = limit ? products.slice(0, limit) : products;

    res.json({ products: limitedProducts });
})

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductByID(productId);

    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
    }
})

/* ----------------------------------------- */
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})