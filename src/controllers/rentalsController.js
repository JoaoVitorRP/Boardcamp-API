import dayjs from "dayjs";
import { connection } from "../database/db.js";

export async function getRentals(req, res) {}

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
