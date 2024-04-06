class ProductManager {
    constructor() {
        this.products = []
        this.nextProductId = 1
    }

    addProduct(product){
        // veriificar si todos los campos requeridos estan presentes
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock']
        const missingFields = requiredFields.filter(field => !(field in product))
        if (missingFields.length > 0){
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
        }

        // verificar si el codigo del producto ya existe
        if(this.products.some(p => p.code === product.code)){
            throw new Error('The product code already exist')
        }

        // agregar un nuevo producto con un ID
        const newProduct = {
            id: this.nextProductId,
            ...products,
        }
        this.products.push(newProduct)
        this.nextProductId++   // incrementa los ID para que no se repitan
        return newProduct
    }

    getProducts(){
        // devolver el arreglo de productos
        return this.products
    }

    getProductById(productId){
        // encontrar un producto por ID
        const product = this.products.find(p => p.id === productId)
        if (!product){
            throw new Error('Product not found')
        }
        return product
    }
}

// instancia de ProductManager
const productManager = new ProductManager()

// "getProducts" recien creada la instancia (deberia devolver un arreglo vacio [])
console.log('Productos iniciales:', productManager.getProducts());

// llamar a "addProduct" con un nuevo producto
const product1 = {
    title: "Fluor",
    description: "0000",
    price: 1200,
    thumbnail: "https://ardiaprod.vtexassets.com/arquivos/ids/264061/Harina-0000-Caserita-1-Kg-_1.jpg?v=638322418209470000",
    code: "1234",
    stock: 4
}
try {
    const productoAgregado = productManager.addProduct(product1);
    console.log('Product successfully added:', productoAgregado);
} catch (error) {
    console.error(error.message);
}

const product2 = {
    title: "Cookies",
    description: "Chocolate",
    price: 1000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa5qb7EqD94BgrkPD2lgBi07O3bmoJTvp-ixJWWjcJvw&s",
    code: "4567",
    stock: 10
}
try {
    const productoAgregado = productManager.addProduct(product2);
    console.log('Product successfully added:', productoAgregado);
} catch (error) {
    console.error(error.message);
}

// llamar a "getProducts" nuevamente para verificar el producto agregado
console.log('Products currently:', productManager.getProducts());

// intentar agregar el mismo producto nuevamente (debe arrojar un error)
try {
    productManager.addProduct(product1);
    console.log('Product successfully added');
} catch (error) {
    console.error(error.message);
}

// buscar el producto por ID
try {
    const productId = productManager.getProducts()[0].id   // tomar el ID del primer producto
    const foundProduct = productManager.getProductById(productId)
    console.log('Product found:', foundProduct);
} catch (error) {
    console.error(error.message);
}