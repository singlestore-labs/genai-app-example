import { readFile } from "fs/promises";
import path from "path";

import { db } from "@/lib/db";

(async () => {
  try {
    await Promise.all(
      ["chat_messages", "products"].map((tableName) => {
        return db.connection.query(`DROP TABLE IF EXISTS ${tableName}`);
      }),
    );

    await Promise.all([
      db.connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        created_at DATETIME,
        title TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
        image VARCHAR(256),
        price DECIMAL(9,2),
        gender VARCHAR(64),
        type_id BIGINT,
        title_v VECTOR(1536),
        description_v VECTOR(1536),
        FULLTEXT KEY(title, description)
      )
    `),

      db.connection.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          created_at BIGINT,
          chat_id BIGINT,
          user_id BIGINT,
          role VARCHAR(64),
          content JSON
      )
    `),
    ]);

    const dataPath = path.join(process.cwd(), "data");
    const fileContent = await readFile(path.join(dataPath, "products-1.json"), "utf-8");
    const values = JSON.parse(fileContent);
    await db.controllers.insertMany({ collection: "products", values });
    console.log("Database is ready");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
