const express = require("express");
const router = express.Router();
const Order = require("../models/order");

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

module.exports = router;
