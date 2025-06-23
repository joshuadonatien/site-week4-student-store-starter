const express = require("express");
const router = express.Router();
const Order = require("../models/order");
// At the top of your route/controller file
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// GET all
router.get("/", async (req, res) => {
  const orders = await Order.getAll();
  res.json(orders);
});

// GET one
router.get("/:id", async (req, res) => {
  const order = await Order.getById(Number(req.params.id));
  res.json(order);
});

// CREATE
router.post("/", async (req, res) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json(newOrder);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Order.update(Number(req.params.id), req.body);
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Order.delete(Number(req.params.id));
  res.json({ message: "Deleted" });
});

// routes/orders.js
router.post('/:order_id/items', async (req, res) => {
  const orderId = parseInt(req.params.order_id);
  const { product_id, quantity } = req.body;

  try {
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create order item with product price
    const orderItem = await prisma.orderItem.create({
      data: {
        order_id: orderId,
        product_id,
        quantity,
        price: product.price,
      },
    });

    res.json(orderItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:order_id/total', async (req, res) => {
  const orderId = parseInt(req.params.order_id);

  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { order_id: orderId },
    });

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Optionally update total_price in DB
    await prisma.order.update({
      where: { id: orderId },
      data: { total_price: total },
    });

    res.json({ orderId, total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
