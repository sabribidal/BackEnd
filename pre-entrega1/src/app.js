import express from 'express'
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';


const app = express()
const PORT = 8080

// Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routers
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)



/* ----------------------------------------- */
app.listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
})