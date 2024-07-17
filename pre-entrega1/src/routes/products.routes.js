import { Router } from "express";
import fs from 'fs'

const router = Router()
const path = './data/products.json'

let products = [];

// cargar productos desde el archivo JSON
const loadProducts = () => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
        products = JSON.parse(data);
    }
};

// guardar productos en el archivo JSON
const saveProducts = () => {
    fs.writeFileSync(path, JSON.stringify(products, null, 2));
};

// inicializar cargando los productos
loadProducts();


// GET
router.get("/", (req, res) => {
    console.log("Listado de productos: ");
    console.log(products);
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    // cuando se proporciona un límite se devuelven los primeros productos
    const limitedProducts = limit ? products.slice(0, limit) : products;

    res.json({ products: limitedProducts });
})

router.get("/:id", (req, res) => {
    const productId = parseInt(req.params.id)
    if (productId) {
        let productIndex = products.findIndex((p) => p.id === productId)
        console.log(`Producto con el id ${productId} encontrado.`);
        res.send(productIndex === -1 ? `Producto con el id ${productId} no encontrado` : products[productIndex])
    } else {
        res.status(400).send({ error: "400", message: "El id es invalido o no existe."})
    }
    res.send(products)
})


// POST
router.post("/", (req, res) => {
    try {
        console.log("Se agrego un nuevo producto!");
        const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

        // validar que todos los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).send({ error: 'Todos los campos son obligatorios, exceptuando thumbnails.' });
        }

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1, // generar un ID único
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };

        products.push(newProduct);
        saveProducts(); // guardar los productos actualizados

        res.status(201).send({ message: "Producto creado con éxito!", product: newProduct });
    } catch (error) {
        console.log("Error guardando producto. Error: " + error);
        res.status(500).send({ error: "Error guardando producto", message: error });
    }
});


// PUT
router.put('/:pid', (req, res) => {
    // ID del producto
    const productId = parseInt(req.params.pid);

    // info del req.body
    const productUpdate = req.body;

    // posición del producto en el array
    const productPosition = products.findIndex((p) => p.id === productId);

    if (productPosition < 0) {
        console.log("Error encontrando producto. Error: " + error);
        return res.status(404).send({ status: "error", message: "Producto no encontrado" });
    }

    // actualizamos el producto, manteniendo el id
    products[productPosition] = { ...products[productPosition], ...productUpdate };

    console.log(`Producto con el id ${productId} actualizado con exito.`);
    res.send({ status: "success", message: "Producto actualizado.", data: products[productPosition] });
});


// DELETE
router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const productPosition = products.findIndex((p) => p.id === productId);
    if (productPosition < 0) {
        return res.status(404).send({ status: "error", message: "Producto no encontrado" });
    }

    products.splice(productPosition, 1);
    saveProducts(); // guardar cambios después de la eliminación

    console.log(`Producto con el id ${productId} fue eliminado.`);
    res.send({ status: "success", message: "Producto eliminado ✅" });
});

export default router