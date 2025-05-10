import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { db } from '@repo/db'
import { products, orders, type NewProduct, type NewOrder } from '@repo/db'
import { eq, and, isNull } from 'drizzle-orm'

// Create a new context
export const createTRPCContext = async () => {
  return {
    db,
  }
}

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create()

// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

// Product input validation schemas
const productSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  price: z.number().positive(),
})

const productIdSchema = z.object({
  id: z.number().int().positive(),
})

// Order input validation schema
const orderProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
})

const createOrderSchema = z.object({
  products: z.array(orderProductSchema),
})

// Define the API router
export const appRouter = router({
  // Product CRUD operations
  products: router({
    // Get all non-deleted products
    getAll: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(products).where(isNull(products.deletedAt))
    }),

    // Get a specific product by ID
    getById: publicProcedure.input(productIdSchema).query(async ({ ctx, input }) => {
      const product = await ctx.db
        .select()
        .from(products)
        .where(and(eq(products.id, input.id), isNull(products.deletedAt)))
        .limit(1)

      return product[0] || null
    }),

    // Create a new product
    create: publicProcedure.input(productSchema).mutation(async ({ ctx, input }) => {
      const newProduct: NewProduct = {
        name: input.name,
        category: input.category,
        quantity: input.quantity,
        price: input.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await ctx.db.insert(products).values(newProduct).returning()
      return result[0]
    }),

    // Update an existing product
    update: publicProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          data: productSchema.partial(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const updateData: Partial<NewProduct> = {
          ...input.data,
          updatedAt: new Date(),
        }

        const result = await ctx.db
          .update(products)
          .set(updateData)
          .where(and(eq(products.id, input.id), isNull(products.deletedAt)))
          .returning()

        return result[0] || null
      }),

    // Soft delete a product
    delete: publicProcedure.input(productIdSchema).mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .update(products)
        .set({ deletedAt: new Date() })
        .where(and(eq(products.id, input.id), isNull(products.deletedAt)))
        .returning()

      return result[0] || null
    }),
  }),

  // Order operations
  orders: router({
    // Create a new order
    create: publicProcedure.input(createOrderSchema).mutation(async ({ ctx, input }) => {
      // Store products as JSON string
      const productsData = JSON.stringify(input.products)

      const newOrder: NewOrder = {
        productsData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Update product quantities
      for (const product of input.products) {
        const currentProduct = await ctx.db.select().from(products).where(eq(products.id, product.id)).limit(1)

        if (currentProduct[0]) {
          await ctx.db
            .update(products)
            .set({
              quantity: Math.max(0, currentProduct[0].quantity - product.quantity),
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id))
        }
      }

      const result = await ctx.db.insert(orders).values(newOrder).returning()
      return result[0]
    }),

    // Get all orders
    getAll: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(orders).where(isNull(orders.deletedAt))
    }),
  }),
})

// Export type definition of the API
export type AppRouter = typeof appRouter
