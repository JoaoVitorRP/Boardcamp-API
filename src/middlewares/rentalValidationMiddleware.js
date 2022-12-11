import { rentalSchema } from "../schemas/rentalSchema.js";
import { connection } from "../database/db.js";

export async function rentalValidation(req, res, next) {
  const { customerId, gameId } = req.body;

  const { error } = rentalSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const gameWithThisId = await connection.query(`SELECT * FROM games WHERE id = ${gameId};`);
    if (gameWithThisId.rows.length === 0) return res.status(400).send("Could not find a game with this id");

    const customerWithThisId = await connection.query(`SELECT * FROM customers WHERE id = ${customerId};`);
    if (customerWithThisId.rows.length === 0) return res.status(400).send("Could not find a customer with this id");

    if (gameWithThisId.rows[0].stockTotal <= 0) return res.status(400).send("Out of stock");

    const gamePrice = gameWithThisId.rows[0].pricePerDay;

    res.locals.gamePrice = gamePrice;
  } catch (err) {
    return res.status(500).send(err);
  }

  next();
}
