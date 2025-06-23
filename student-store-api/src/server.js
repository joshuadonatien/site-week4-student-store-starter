const express = require("express")
const cors = require("cors")
const Product = require("./db/product")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const orderRoutes = require("./routes/orders");

const app = express()
app.use(cors())
app.use(express.json())
app.use("/orders", orderRoutes);


// Create product
app.post("/products", async (req, res) => {
  try {
    const product = await Product.createProduct(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all products
app.get("/products", async (req, res) => {
  const { category, sort } = req.query

  const filters = category ? { where: { category } } : {}
  const sortOrder = sort ? { orderBy: { [sort]: "asc" } } : {}

  try {
    const products = await prisma.product.findMany({
      ...filters,
      ...sortOrder,
    })
    res.json({ products })
  } catch (err) {
    console.error("Error fetching products:", err)
    res.status(500).json({ error: "Internal server error" })
  }
});




// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id)
    if (product) res.json(product)
    else res.status(404).json({ error: "Not found" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.updateProduct(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.deleteProduct(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
