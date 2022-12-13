import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function getRentals(req, res) {
  const { customerId, gameId, status, startDate } = req.query;

  let bind;
  if (customerId) bind = customerId;
  if (gameId) bind = gameId;
  if (startDate) bind = startDate;

  try {
    const rentalsCustomerGame = await connection.query(
      `
      SELECT
        r.*,
        ( SELECT row_to_json(customerRows) 
          FROM (SELECT c.id, c.name) 
          AS customerRows ) 
        AS customer,
        ( SELECT row_to_json(gameRows) 
          FROM (SELECT g.id, g.name, g."categoryId", ca.name AS "categoryName") 
          AS gameRows ) 
        AS game
      FROM
        rentals AS r
      JOIN
        customers AS c
      ON
        r."customerId" = c.id
      JOIN
        games AS g
      ON 
        r."gameId" = g.id
      JOIN
        categories AS ca
      ON
        g."categoryId" = ca.id
      ${customerId ? `WHERE "customerId" = $1` : ` `}
      ${gameId ? `WHERE "gameId" = $1` : ` `}
      ${status === 'open' ? `WHERE "returnDate" IS NULL` : ` `}
      ${status === 'closed' ? `WHERE "returnDate" IS NOT NULL` : ` `}
      ${startDate ? `WHERE "rentDate" >= $1` : ` `};
    `,
      bind ? [bind] : []
    );

    res.send(rentalsCustomerGame.rows);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const gamePrice = res.locals.gamePrice;
  const todayDate = dayjs().format("YYYY-MM-DD");

  try {
    await connection.query(
      `
      INSERT
      INTO 
        rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES 
        (${customerId}, ${gameId}, '${todayDate}', ${daysRented}, null, ${gamePrice * daysRented}, null);
      `
    );

    await connection.query(
      `
      UPDATE games
      SET
        "stockTotal" = "stockTotal" - 1
      WHERE
        id = $1;
      `,
      [gameId]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function finishRental(req, res) {
  const { id } = req.params;

  try {
    const rental = res.locals.rental;
    rental.returnDate = dayjs().format("YYYY-MM-DD");

    const rentDate = dayjs(rental.rentDate);
    const returnDate = dayjs(rental.returnDate);
    const delay = returnDate.diff(rentDate, "day");

    if (delay > 0) rental.delayFee = rental.originalPrice * (delay - rental.daysRented);
    if (delay <= 0) rental.delayFee = 0;

    await connection.query(
      `
      UPDATE rentals
      SET
        "returnDate" = '${rental.returnDate}', "delayFee" = '${rental.delayFee}'
      WHERE
        id = $1;
      `,
      [id]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  const gameId = res.locals.gameId;

  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

    await connection.query(
      `
      UPDATE games
      SET
        "stockTotal" = "stockTotal" + 1
      WHERE
        id = $1;
      `,
      [gameId]
    );

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
