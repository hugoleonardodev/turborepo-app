import { pgTable, serial, varchar, integer, doublePrecision, timestamp, text } from 'drizzle-orm/pg-core'

// Product table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  price: doublePrecision('price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

// Order table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  productsData: text('products_data').notNull(), // Storing product list as JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})

// Define types based on schema
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
