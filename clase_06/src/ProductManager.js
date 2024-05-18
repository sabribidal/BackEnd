import fs from 'fs'

export class ProductManager {
    constructor(){
        this.products = [];
        this.nextProductId = 1;
        this.productDirPath = "./Products";
        this.productFilePath = this.productDirPath + "/products.json"; 
        this.fileSystem = fs
    }

    addProducts = async (...products) => { 
        try {
            // creamos el directorio
            await this.fileSystem.promises.mkdir(this.productDirPath, { recursive: true });
    
            // validamos que exista ya el archivo con productos, sino se crea vacío para ingresar nuevos:
            if (!this.fileSystem.existsSync(this.productFilePath)) {
                // se crea el archivo vacío
                await this.fileSystem.promises.writeFile(this.productFilePath, "[]");
            }
    
            // verificar si todos los campos requeridos están presentes para cada producto
            const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
            products.forEach(product => {
                const missingFields = requiredFields.filter(field => !(field in product));
                if (missingFields.length > 0){
                    throw new Error(`Missing required fields for product ${product.title}: ${missingFields.join(', ')}`);
                }
            });
    
            // agregar nuevos productos con un ID
            products.forEach(product => {
                const newProduct = {
                    id: this.nextProductId,
                    ...product,
                };
                this.products.push(newProduct);
                this.nextProductId++; // incrementa los ID para que no se repitan
            });
    
            console.log("Productos agregados correctamente✅");
    
            // se sobreescribe el archivo de productos para persistencia.
            await this.fileSystem.promises.writeFile(this.productFilePath, JSON.stringify(this.products, null, 2, '\t'));
        } catch (error) {
            console.error("Error al agregar los productos:", error);
            throw error;
        }
    }    

    getProducts = async () => {
        try {
            // leer el archivo de productos
            const productData = await this.fileSystem.promises.readFile(this.productFilePath, 'utf-8');
    
            // parsear los datos del archivo a formato JSON
            this.products = JSON.parse(productData);
    
            return this.products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return []; // devolver un arreglo vacío en caso de error
        }
    }

    getProductByID = async (productId) => {
        try {
            const products = await this.getProducts(); // método getProducts para obtener los productos

            // buscar el producto por ID
            const product = products.find(p => p.id === productId);

            if (product) {
                return product;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
            throw error;
        }
    }

    updateProduct = async (productId, updatedFields) => {
        try {
            let products = await this.getProducts();

            // buscar el índice del producto a actualizar
            const index = products.findIndex(p => p.id === productId);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            // actualizar el producto con los campos proporcionados
            products[index] = { ...products[index], ...updatedFields, id: productId };

            // escribir los productos actualizados en el archivo
            await this.fileSystem.promises.writeFile(this.productFilePath, JSON.stringify(products, null, 2, '\t'));

            return products[index];
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    deleteProduct = async (productId) => {
        try {
            let products = await this.getProducts(); 

            const index = products.findIndex(p => p.id === productId);
            if (index === -1) {
                throw new Error('Producto no encontrado');
            }

            // eliminar el producto del array
            const deletedProduct = products.splice(index, 1)[0];

            await this.fileSystem.promises.writeFile(this.productFilePath, JSON.stringify(products, null, 2, '\t'));

            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        } 
    }
}

// TESTING //

(async () => {
    // crear una instancia de la clase
    const productManager = new ProductManager();

    // agregar un nuevo producto con los campos requeridos
    const product1 = {
        title: "Chocolinas",
        description: "Galletitas de chocolate",
        price: 1000.99,
        thumbnail: "https://n9.cl/h8tpe",
        code: "abc123",
        stock: 50
    }
    const product2 = {
        title: "Danette",
        description: "Postre de chocolate",
        price: 990,
        thumbnail: "https://n9.cl/rndcu",
        code: "abc123",
        stock: 10
    }
    const product3 = {
        title: "Chocolate Milka",
        description: "Chocolate con leche aireado",
        price: 1800,
        thumbnail: "https://n9.cl/d5s27",
        code: "abc123",
        stock: 25
    }
    const product4 = {
        title: "Fideos Marolio",
        description: "Fideos de sémola",
        price: 1000,
        thumbnail: "https://n9.cl/yw7x2",
        code: "abc124",
        stock: 100
    }
    const product5 = {
        title: "Yerba Mate Taragüi",
        description: "Yerba mate con palo",
        price: 2260,
        thumbnail: "https://n9.cl/za1s5",
        code: "abc125",
        stock: 75
    }
    const product6 = {
        title: "Dulce de Leche La Serenísima",
        description: "Dulce de leche clásico",
        price: 1200,
        thumbnail: "https://n9.cl/d0es1",
        code: "abc126",
        stock: 30
    }
    const product7 = {
        title: "Aceite Natura",
        description: "Aceite de girasol",
        price: 660.70,
        thumbnail: "https://n9.cl/o33qlp",
        code: "abc127",
        stock: 60
    }
    const product8 = {
        title: "Harina Blancaflor",
        description: "Harina leudante",
        price: 1139,
        thumbnail: "https://n9.cl/7k8o6",
        code: "abc128",
        stock: 40
    }
    const product9 = {
        title: "Arroz Gallo Oro",
        description: "Arroz doble carolina",
        price: 3860,
        thumbnail: "https://n9.cl/irc16",
        code: "abc129",
        stock: 90
    }
    const product10 = {
        title: "Mayonesa Hellmann's",
        description: "Mayonesa clásica",
        price: 4300.40,
        thumbnail: "https://n9.cl/qu0mf",
        code: "abc130",
        stock: 20
    }
    await productManager.addProducts(product1, product2, product3, product4, product5, product6, product7, product8, product9, product10);
    
    // Llamar al método getProducts para obtener todos los productos
    const updatedProducts = await productManager.getProducts();
    console.log("Productos existentes:", updatedProducts);

    // obtener el producto por ID 
    const productId = 1; // ID del Producto 1
    try {
        const product = await productManager.getProductByID(productId);
        console.log("Producto encontrado:", product);
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error);
    }
})();