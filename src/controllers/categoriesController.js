import { connection } from "../database/db.js";
import { categorySchema } from "../schemas/categorySchema.js";

export async function getCategories(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.send(categories.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function postCategory(req, res) {
  const { name } = req.body;

  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const categoryAlreadyExists = await connection.query(`SELECT * FROM categories WHERE name = '${name}';`);

    if (categoryAlreadyExists.rows.length !== 0) return res.status(409).send("This category already exists");

    await connection.query(`INSERT INTO categories (name) VALUES ('${name}');`);

    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
