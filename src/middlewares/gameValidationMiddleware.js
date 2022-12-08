import { connection } from "../database/db.js";
import { gameSchema } from "../schemas/gameSchema.js";

export async function gameValidation(req, res, next) {
  const { name, categoryId } = req.body;

  const { error } = gameSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const gamesWithSameName = await connection.query(`SELECT * FROM games WHERE name = '${name}';`);
    if (gamesWithSameName.rows.length !== 0) return res.sendStatus(409);

    const categoryWithThisId = await connection.query(`SELECT * FROM categories WHERE id = ${categoryId};`);
    if (categoryWithThisId.rows.length === 0) return res.sendStatus(400);
  } catch (err) {
    return res.status(500).send(err);
  }

  next();
}
