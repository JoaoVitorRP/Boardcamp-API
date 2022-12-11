import { connection } from "../database/db.js";

export async function rentalReturnValidation(req, res, next) {
  const { id } = req.params;

  try {
    const rentalWithThisId = await connection.query(
      `
      SELECT *, rentals."rentDate"::text 
      FROM rentals 
      WHERE id = $1;`,
      [id]
    );
    if (rentalWithThisId.rows.length === 0) return res.status(404).send("Could not find a rental with this id");

    const rentalIsFinished = rentalWithThisId.rows[0].returnDate;
    if (rentalIsFinished) return res.status(400).send("This rental is already finished");

    res.locals.rental = rentalWithThisId.rows[0];
  } catch (err) {
    return res.status(500).send(err);
  }

  next();
}
