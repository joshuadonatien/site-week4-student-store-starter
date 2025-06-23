const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class Order {
  static async create(data) {
    return await prisma.order.create({
      data: {
        customer_id: data.customer_id,
        total_price: data.total_price,
        status: data.status,
        created_at: new Date("2023-06-23T10:00:00Z"),
        items: {
          create: data.items // <- array of { product_id, quantity, price }
        }
      }
    })
  }

  static async getAll() {
    return await prisma.order.findMany();
  }

  static async getById(id) {
  return await prisma.order.findUnique({
    where: {
      id: parseInt(id) // Ensure `id` is a number
    }
  })
}


  static async update(id, data) {
  return await prisma.order.update({
    where: { id: parseInt(id) },
    data
  });
}

  // src/models/order.js
static async delete(id) {
  const orderId = parseInt(id);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error(`Order with id ${id} not found`);
  }

  // 1. Delete related order items first
  await prisma.orderItem.deleteMany({
  where: { order_id: id },
});

// Then delete the order
return await prisma.order.delete({
  where: { id },
});

}


}

module.exports = Order;
