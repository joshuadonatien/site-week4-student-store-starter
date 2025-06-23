const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class Product {
  static async createProduct(data) {
    return await prisma.product.create({ data })
  }

  static async getAllProducts() {
    return await prisma.product.findMany()
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({ where: { id: Number(id) } })
  }

  static async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data,
    })
  }

  static async deleteProduct(id) {
    return await prisma.product.delete({ where: { id: Number(id) } })
  }
}

module.exports = Product
