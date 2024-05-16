class ProductManager {
    constructor(){
        this.products = [];
        this.nextProductId = 1;
        this.productDirPath = "./Products";
        this.productFilePath = this.productDirPath + "/products.json"; 
        this.fileSystem = require('fs');
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

    // llamar al método getProducts (inicialmente deberia devolver un array vacio)
    const products = await productManager.getProducts();
    if (Array.isArray(products) && products.length === 0) {
        console.log(products);
    } else {
        console.log('El método getProducts NO devuelve un arreglo vacío');
    }

    // agregar un nuevo producto con los campos requeridos
    const product1 = {
        title: "Chocolinas",
        description: "Galletitas de chocolate",
        price: 1000.99,
        thumbnail: "https://www.deliargentina.com/image/cache/catalog/product/alimentacion/galletitas-chocolinas-bagley-argentinas/chocolinas-250gr--galletitas-argentinas-rincon-gaucho-yerba-mate-verdeflor-carne-argentina-productos-argentinos-galletitas-argentinas-335x335.jpg",
        code: "abc123",
        stock: 50
    }
    const product2 = {
        title: "Danette",
        description: "Postre de chocolate",
        price: 990,
        thumbnail: "https://dcdn.mitiendanube.com/stores/001/108/127/products/danette-chocolatebyb1-d38c76740dce72452c16025141342924-640-0.png",
        code: "abc123",
        stock: 10
    }
    const product3 = {
        title: "Milka",
        description: "Chocolate con leche aireado",
        price: 1800,
        thumbnail: "https://masonlineprod.vtexassets.com/arquivos/ids/278107-800-auto?v=638163273852700000&width=800&height=auto&aspect=true",
        code: "abc123",
        stock: 25
    }
    await productManager.addProducts(product1, product2, product3);
    
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

    // actualizar un campo del producto sin eliminar ID
    const productIdToUpdate = 3; // ID del Producto 3
    const updatedFields = {
        price: 890
    };
    try {
        const updatedProduct = await productManager.updateProduct(productIdToUpdate, updatedFields);
        console.log("🔁 Producto actualizado correctamente:", updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
    }

    // Llamar al método deleteProduct para eliminar el producto
    await productManager.deleteProduct(productId);
    console.log(`Producto ${productId} eliminado correctamente ❌`);

})();
