import { connection } from "../database/db.js";

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    const games = await connection.query(
      `
      SELECT games.*, categories.name AS "categoryName"
      FROM
        games
      JOIN
        categories
      ON
        games."categoryId" = categories.id
      ${name ? `WHERE LOWER(games.name) LIKE $1` : ` `};
      `,
      name ? [`${name}%`] : []
    );

    res.send(games.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

export async function postGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `INSERT
      INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay});`
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err);
  }
}
