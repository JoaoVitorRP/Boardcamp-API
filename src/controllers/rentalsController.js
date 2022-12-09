import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  let id;
  if (customerId) id = customerId;
  if (gameId) id = gameId;

  try {
    const rentalsCustomerGame = await connection.query(
      `
      SELECT
        json_agg(
          json_build_object(
            'id', r.id,
            'customerId', r."customerId",
            'gameId', r."gameId",
            'rentDate', r."rentDate",
            'daysRented', r."daysRented",
            'returnDate', r."returnDate",
            'originalPrice', r."originalPrice",
            'delayFee', r."delayFee",
            'customer', json_build_object(
              'id', c.id,
              'name', c.name
            ),
            'game', json_build_object(
              'id', g.id,
              'name', g.name,
              'categoryId', g."categoryId",
              'categoryName', ca.name
            )
          )
        )
      FROM
        rentals r
      JOIN
        customers c
      ON
        r."customerId" = c.id
      JOIN
        games g
      ON 
        r."gameId" = g.id
      JOIN
        categories ca
      ON
        g."categoryId" = ca.id
      ${customerId ? `WHERE "customerId" = $1` : ` `}
      ${gameId ? `WHERE "gameId" = $1` : ` `};
    `,
      [id]
    );

    res.send(rentalsCustomerGame.rows[0].json_agg);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const gamePrice = res.locals.gamePrice;
  const todayDate = dayjs().format("YYYY-MM-DD");

  try {
    await connection.query(`
      INSERT
      INTO 
        rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES 
        (${customerId}, ${gameId}, '${todayDate}', ${daysRented}, null, ${gamePrice * daysRented}, null);
      `);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function finishRental(req, res) {}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
}
