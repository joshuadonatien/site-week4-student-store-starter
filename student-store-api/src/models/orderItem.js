const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderItemModel {
  static async create(orderId, productId, quantity, price) {
    return await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
    });
  }

  static async getByOrderId(orderId) {
    return await prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true }, // Optional: include product details
    });
  }
}

module.exports = OrderItemModel;
