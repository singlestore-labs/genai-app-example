import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ProductList({
  className,
  products,
}: {
  className?: string;
  products: Pick<Product, "id" | "title" | "price" | "image">[];
}) {
  return (
    <ul className={cn("flex gap-4 overflow-x-auto overflow-y-hidden", className)}>
      {products.map((product) => (
        <li
          key={product.id}
          className="flex-1"
        >
          <Card className="w-full overflow-hidden">
            <div className="relative h-0 w-full overflow-hidden border-b pt-[100%]">
              <img
                className="absolute left-0 top-0 h-full w-full object-cover"
                src={product.image}
                alt={product.title}
              />
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-2">
              <h4 className="line-clamp-2 font-medium capitalize">{product.title}</h4>
              <p className="font-medium">${product.price}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
