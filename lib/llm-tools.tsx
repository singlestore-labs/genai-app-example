import { z } from "zod";

import { LLMTool, Product } from "@/types";
import { db } from "@/lib/db";
import { ProductList } from "@/components/product-list";

// Map of tools that can be called by the LLM.
export const llmTools: Record<string, LLMTool> = {
  get_random_products: {
    name: "get_random_products",
    description: "Useful when you need to get random products",
    schema: z.object({ limit: z.number().min(1).optional().describe("Number of products to get") }),
    node: (props) => (
      <ProductList
        {...props}
        className="px-4"
      />
    ),
    call: async ({ limit = 5 }) => {
      const products = await db.controllers.query<Pick<Product, "id" | "title" | "price" | "image">[]>({
        query: `\
          SELECT id, title, price, image FROM products ORDER BY RAND() LIMIT ${limit}
        `,
      });
      return { name: "get_random_products", props: { products } };
    },
  },

  find_products: {
    name: "find_products",
    description: "Useful when you need to find products",
    schema: z.object({
      keyword: z.string().optional(),
      limit: z.number().min(1).optional().describe("Number of products to find"),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }),
    node: (props) => (
      <ProductList
        {...props}
        className="px-4"
      />
    ),
    call: async ({ keyword, limit = 5, minPrice, maxPrice }) => {
      const whereDefinitions: string[] = [];

      if (keyword) {
        whereDefinitions.push(`MATCH(title) AGAINST ('${keyword}')`);
      }

      if (minPrice) {
        whereDefinitions.push(`price >= ${minPrice}`);
      }

      if (maxPrice) {
        whereDefinitions.push(`price <= ${maxPrice}`);
      }

      const products = await db.controllers.query<Pick<Product, "id" | "title" | "price" | "image">[]>({
        query: `\
        SELECT id, title, price, image
        FROM products
        ${whereDefinitions.length ? `WHERE ${whereDefinitions.join(" AND ")}` : ""}
        LIMIT ${limit}
      `,
      });

      return { name: "find_products", props: { products } };
    },
  },
};
