CREATE TYPE "public"."measure_type" AS ENUM('weight', 'volume', 'count');--> statement-breakpoint
CREATE TYPE "public"."inventory_movement_type" AS ENUM('initial', 'purchase', 'consumption', 'waste', 'adjustment_in', 'adjustment_out');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"category_id" integer NOT NULL,
	"measure_type" "measure_type" NOT NULL,
	"stock" numeric(18, 3) DEFAULT '0' NOT NULL,
	"min_stock" numeric(18, 3) DEFAULT '0' NOT NULL,
	"average_cost" numeric(18, 6) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ingredients_name_unique" UNIQUE("name"),
	CONSTRAINT "ingredients_stock_nonnegative" CHECK ("ingredients"."stock" >= 0),
	CONSTRAINT "ingredients_min_stock_nonnegative" CHECK ("ingredients"."min_stock" >= 0),
	CONSTRAINT "ingredients_average_cost_nonnegative" CHECK ("ingredients"."average_cost" >= 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"ingredient_id" integer NOT NULL,
	"type" "inventory_movement_type" NOT NULL,
	"quantity_delta" numeric(18, 3) NOT NULL,
	"unit_cost" numeric(18, 6) NOT NULL,
	"total_cost" numeric(18, 2) NOT NULL,
	"reason" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_movements_quantity_nonzero" CHECK ("inventory_movements"."quantity_delta" <> 0),
	CONSTRAINT "inventory_movements_unit_cost_nonnegative" CHECK ("inventory_movements"."unit_cost" >= 0),
	CONSTRAINT "inventory_movements_total_cost_nonnegative" CHECK ("inventory_movements"."total_cost" >= 0)
);
--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ingredients_category_idx" ON "ingredients" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "inventory_movements_ingredient_idx" ON "inventory_movements" USING btree ("ingredient_id");--> statement-breakpoint
CREATE INDEX "inventory_movements_date_idx" ON "inventory_movements" USING btree ("occurred_at");