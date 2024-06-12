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
};
