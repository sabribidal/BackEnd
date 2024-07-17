import { Router } from "express";
import fs from 'fs';

const router = Router();
const path = './data/cart.json';

let carts = [];

// cargar carritos desde el archivo JSON
const loadCarts = () => {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, 'utf8');
        carts = JSON.parse(data);
    }
};

// guardar carritos en el archivo JSON
const saveCarts = () => {
    fs.writeFileSync(path, JSON.stringify(carts, null, 2));
};

// inicializar cargando los carritos
loadCarts();


// GET
router.get('/:cId', (req, res) => {
    const cartId = parseInt(req.params.cId);

    const cart = carts.find(c => c.id === cartId); // buscar el carrito por su ID
    
    if (!cart) {
        console.log(`No se pudo encontrar el carrito con el id ${cartId} 🤷🏻‍♀️`);
        return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
    }

    // retornar los productos del carrito
    res.send({ status: "success", products: cart.products });
});


// POST
router.post("/", (req, res) => {
    try {
        console.log("Se creó un nuevo carrito! 🛒");

        const newCartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1; // generar un ID único para el carrito

        const newCart = {
            id: newCartId,
            products: [] // se inicia con el carrito vacio preferentemente
        };

        carts.push(newCart);
        saveCarts(); // guardar los carritos actualizados

        res.status(201).send({ message: "Carrito creado con éxito!", cart: newCart });
    } catch (error) {
        console.log("Error guardando carrito. Error: " + error);
        res.status(500).send({ error: "Error guardando carrito", message: error });
    }
});

router.post('/:cId/product/:pId', (req, res) => {
    const cartId = parseInt(req.params.cId);
    const productId = parseInt(req.params.pId);

    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        console.log("No se encontro el carrito 🤷🏻‍♀️");
        return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
    }

    // buscar el producto en el carrito
    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
        // si el producto ya existe se incrementa la cantidad
        console.log("Se agrego un producto mas! 🛍️");
        existingProduct.quantity += 1;
    } else {
        // si el producto no existe se lo agrega al carrito
        console.log("Se agrego un nuevo producto al carrito");
        const newProduct = {
            product: productId,
            quantity: 1
        };
        cart.products.push(newProduct);
    }

    saveCarts(); // guardar cambios en el archivo JSON

    res.status(200).send({ status: "success", message: "Producto agregado al carrito", cart });
});

export default router;