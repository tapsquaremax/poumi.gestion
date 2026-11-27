
import {
  pgTable,
  pgEnum,
  serial,
  integer,
  varchar,
  text,
  numeric,
  timestamp,
  index,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const measureTypeEnum = pgEnum('measure_type', [
  'weight',
  'volume',
  'count',
])

export const movementTypeEnum = pgEnum('inventory_movement_type', [
  'initial',
  'purchase',
  'consumption',
  'waste',
  'adjustment_in',
  'adjustment_out',
])

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),

  name: varchar('name', { length: 100 })
    .notNull()
    .unique(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
})

export const ingredients = pgTable(
  'ingredients',
  {
    id: serial('id').primaryKey(),

    name: varchar('name', { length: 150 })
      .notNull()
      .unique(),

    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, {
        onDelete: 'restrict',
      }),

    measureType: measureTypeEnum('measure_type').notNull(),

    stock: numeric('stock', {
      precision: 18,
      scale: 3,
    })
      .default('0')
      .notNull(),

    minStock: numeric('min_stock', {
      precision: 18,
      scale: 3,
    })
      .default('0')
      .notNull(),

    averageCost: numeric('average_cost', {
      precision: 18,
      scale: 6,
    })
      .default('0')
      .notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('ingredients_category_idx').on(table.categoryId),
    check('ingredients_stock_nonnegative', sql`${table.stock} >= 0`),
    check('ingredients_min_stock_nonnegative', sql`${table.minStock} >= 0`),
    check('ingredients_average_cost_nonnegative', sql`${table.averageCost} >= 0`),
  ]
)

export const inventoryMovements = pgTable(
  'inventory_movements',
  {
    id: serial('id').primaryKey(),

    ingredientId: integer('ingredient_id')
      .notNull()
      .references(() => ingredients.id, {
        onDelete: 'restrict',
      }),

    type: movementTypeEnum('type').notNull(),

    quantityDelta: numeric('quantity_delta', {
      precision: 18,
      scale: 3,
    }).notNull(),

    unitCost: numeric('unit_cost', {
      precision: 18,
      scale: 6,
    }).notNull(),

    totalCost: numeric('total_cost', {
      precision: 18,
      scale: 2,
    }).notNull(),

    reason: text('reason'),

    occurredAt: timestamp('occurred_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('inventory_movements_ingredient_idx').on(
      table.ingredientId
    ),
    index('inventory_movements_date_idx').on(
      table.occurredAt
    ),
    check(
      'inventory_movements_quantity_nonzero',
      sql`${table.quantityDelta} <> 0`
    ),
    check(
      'inventory_movements_unit_cost_nonnegative',
      sql`${table.unitCost} >= 0`
    ),
    check(
      'inventory_movements_total_cost_nonnegative',
      sql`${table.totalCost} >= 0`
    ),
  ]
)
